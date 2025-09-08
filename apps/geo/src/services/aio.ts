import { AIOAnalysis, Entity, DataTable } from '@/types/geo';

export class AIOOptimizer {
  analyzeForAI(content: string, title: string): AIOAnalysis {
    // Analyze content structure
    const structureScore = this.analyzeStructure(content);
    
    // Extract entities
    const entities = this.extractEntities(content);
    
    // Analyze for featured snippet potential
    const featuredSnippetPotential = this.analyzeFeaturedSnippetPotential(content);
    
    // Check summary quality
    const summaryQuality = this.analyzeSummaryQuality(content);
    
    // Generate data table suggestions
    const dataTableSuggestions = this.generateDataTableSuggestions(content);
    
    // Calculate overall AIO score
    const score = this.calculateAIOScore({
      structureScore,
      featuredSnippetPotential,
      summaryQuality,
      entityCount: entities.length,
      dataTableCount: dataTableSuggestions.length
    });

    return {
      score,
      featuredSnippetPotential,
      summaryQuality,
      structureScore,
      entityRecognition: entities,
      dataTableSuggestions
    };
  }

  private analyzeStructure(content: string): number {
    let score = 0;
    
    // Check for proper heading hierarchy
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
    
    if (h2Count >= 3 && h2Count <= 10) score += 20;
    if (h3Count >= h2Count && h3Count <= h2Count * 3) score += 15;
    
    // Check for lists
    const ulCount = (content.match(/<ul[^>]*>/gi) || []).length;
    const olCount = (content.match(/<ol[^>]*>/gi) || []).length;
    if (ulCount + olCount >= 2) score += 15;
    
    // Check for definition-style content
    const definitionPattern = /<p><strong>[^<]+<\/strong>:\s*[^<]+<\/p>/gi;
    const definitions = content.match(definitionPattern) || [];
    if (definitions.length >= 3) score += 20;
    
    // Check for Q&A style
    const questionPattern = /<h[2-3][^>]*>[^<]*\?[^<]*<\/h[2-3]>/gi;
    const questions = content.match(questionPattern) || [];
    if (questions.length >= 2) score += 15;
    
    // Check for summary/conclusion
    const conclusionPattern = /<h[2-3][^>]*>(conclusion|summary|final thoughts|key takeaways)[^<]*<\/h[2-3]>/gi;
    if (conclusionPattern.test(content)) score += 15;
    
    return Math.min(100, score);
  }

  private extractEntities(content: string): Entity[] {
    const entities: Entity[] = [];
    
    // Simple entity extraction (in production, use NLP library)
    // Product names
    const productPattern = /Eufy\s+[A-Z0-9]+/gi;
    const products = content.match(productPattern) || [];
    products.forEach(product => {
      if (!entities.find(e => e.name === product)) {
        entities.push({
          name: product,
          type: 'Product',
          relevance: 0.9,
          wikidata: undefined
        });
      }
    });
    
    // Technical terms (simplified)
    const techTerms = [
      'AI', 'Machine Learning', 'Computer Vision', 'Motion Detection',
      'Night Vision', 'Two-Way Audio', 'HomeKit', 'Google Assistant',
      'Alexa', 'RTSP', 'Local Storage', 'Cloud Storage'
    ];
    
    techTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(content)) {
        entities.push({
          name: term,
          type: 'Technology',
          relevance: 0.7,
          wikidata: undefined
        });
      }
    });
    
    // Features
    const featurePattern = /\b(resolution|battery life|detection range|storage capacity|field of view)\b/gi;
    const features = content.match(featurePattern) || [];
    features.forEach(feature => {
      if (!entities.find(e => e.name.toLowerCase() === feature.toLowerCase())) {
        entities.push({
          name: feature,
          type: 'Feature',
          relevance: 0.6,
          wikidata: undefined
        });
      }
    });
    
    return entities.slice(0, 10); // Return top 10 entities
  }

  private analyzeFeaturedSnippetPotential(content: string): number {
    let score = 0;
    
    // Check for direct answer in first paragraph
    const firstParagraph = content.match(/<p[^>]*>.*?<\/p>/i);
    if (firstParagraph && firstParagraph[0].length >= 50 && firstParagraph[0].length <= 300) {
      score += 30;
    }
    
    // Check for numbered/bulleted list early in content
    const firstListPosition = content.search(/<(ul|ol)[^>]*>/i);
    if (firstListPosition > 0 && firstListPosition < 500) {
      score += 25;
    }
    
    // Check for table
    if (/<table[^>]*>/i.test(content)) {
      score += 20;
    }
    
    // Check for Q&A format
    const qaPattern = /<h[2-3][^>]*>[^<]*\?[^<]*<\/h[2-3]>\s*<p[^>]*>/gi;
    if (qaPattern.test(content)) {
      score += 25;
    }
    
    return Math.min(100, score);
  }

  private analyzeSummaryQuality(content: string): number {
    let score = 0;
    
    // Check if content starts with a clear introduction
    const introPattern = /<p[^>]*>[^<]{100,500}<\/p>/;
    if (introPattern.test(content.substring(0, 1000))) {
      score += 30;
    }
    
    // Check for key points or highlights section
    const keyPointsPattern = /<h[2-3][^>]*>(key points|highlights|overview|at a glance)[^<]*<\/h[2-3]>/gi;
    if (keyPointsPattern.test(content)) {
      score += 25;
    }
    
    // Check for conclusion
    const conclusionPattern = /<h[2-3][^>]*>(conclusion|summary|bottom line)[^<]*<\/h[2-3]>/gi;
    if (conclusionPattern.test(content)) {
      score += 25;
    }
    
    // Check content length (optimal for AI summarization)
    const wordCount = content.replace(/<[^>]*>/g, ' ').match(/\b\w+\b/g)?.length || 0;
    if (wordCount >= 800 && wordCount <= 2500) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  private generateDataTableSuggestions(content: string): DataTable[] {
    const suggestions: DataTable[] = [];
    
    // Suggest comparison table if multiple products mentioned
    const productPattern = /Eufy\s+[A-Z0-9]+/gi;
    const products = Array.from(new Set(content.match(productPattern) || []));
    
    if (products.length >= 2) {
      suggestions.push({
        title: 'Product Comparison',
        headers: ['Feature', ...products],
        rows: [
          ['Resolution', ...products.map(() => 'TBD')],
          ['Battery Life', ...products.map(() => 'TBD')],
          ['Price', ...products.map(() => 'TBD')],
          ['Storage', ...products.map(() => 'TBD')]
        ],
        relevance: 0.9
      });
    }
    
    // Suggest specifications table if technical content
    const specKeywords = ['resolution', 'battery', 'storage', 'dimension', 'weight'];
    const hasSpecs = specKeywords.some(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(content)
    );
    
    if (hasSpecs) {
      suggestions.push({
        title: 'Technical Specifications',
        headers: ['Specification', 'Value'],
        rows: [
          ['Resolution', 'TBD'],
          ['Battery Life', 'TBD'],
          ['Storage Options', 'TBD'],
          ['Connectivity', 'TBD'],
          ['Dimensions', 'TBD']
        ],
        relevance: 0.8
      });
    }
    
    // Suggest pros/cons table
    if (content.includes('pros') || content.includes('cons') || content.includes('advantages')) {
      suggestions.push({
        title: 'Pros and Cons',
        headers: ['Pros', 'Cons'],
        rows: [
          ['TBD', 'TBD'],
          ['TBD', 'TBD'],
          ['TBD', 'TBD']
        ],
        relevance: 0.7
      });
    }
    
    return suggestions;
  }

  private calculateAIOScore(metrics: {
    structureScore: number;
    featuredSnippetPotential: number;
    summaryQuality: number;
    entityCount: number;
    dataTableCount: number;
  }): number {
    const weights = {
      structure: 0.25,
      snippet: 0.25,
      summary: 0.20,
      entities: 0.15,
      tables: 0.15
    };
    
    const entityScore = Math.min(100, metrics.entityCount * 10);
    const tableScore = Math.min(100, metrics.dataTableCount * 33);
    
    return Math.round(
      metrics.structureScore * weights.structure +
      metrics.featuredSnippetPotential * weights.snippet +
      metrics.summaryQuality * weights.summary +
      entityScore * weights.entities +
      tableScore * weights.tables
    );
  }

  generateSchemaMarkup(
    type: 'Article' | 'FAQ' | 'HowTo' | 'Product' | 'Review',
    data: any
  ): any {
    // Generate appropriate schema markup based on content type
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type
    };

    switch (type) {
      case 'Article':
        return {
          ...baseSchema,
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Person',
            name: data.author
          },
          datePublished: data.publishedDate,
          dateModified: data.modifiedDate,
          publisher: {
            '@type': 'Organization',
            name: 'Eufy',
            logo: {
              '@type': 'ImageObject',
              url: 'https://eufy.com/logo.png'
            }
          }
        };
      
      case 'FAQ':
        return {
          ...baseSchema,
          mainEntity: data.questions.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer
            }
          }))
        };
      
      case 'Product':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          brand: {
            '@type': 'Brand',
            name: 'Eufy'
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        };
      
      default:
        return baseSchema;
    }
  }
}

export const aioOptimizer = new AIOOptimizer();