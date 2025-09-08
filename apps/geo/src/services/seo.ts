import { SEOAnalysis, SEOIssue, SEOSuggestion, ReadabilityScore, TechnicalSEO } from '@/types/geo';

export class SEOAnalyzer {
  analyzeContent(content: string, metaTitle?: string, metaDescription?: string): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const suggestions: SEOSuggestion[] = [];

    // Analyze technical SEO
    const technicalSEO = this.analyzeTechnicalSEO(content, metaTitle, metaDescription);
    
    // Check title
    if (!metaTitle || metaTitle.length === 0) {
      issues.push({
        type: 'error',
        category: 'Meta Title',
        message: 'Missing meta title',
        impact: 'high'
      });
    } else if (metaTitle.length < 30) {
      issues.push({
        type: 'warning',
        category: 'Meta Title',
        message: 'Meta title is too short (< 30 characters)',
        impact: 'medium'
      });
    } else if (metaTitle.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Meta Title',
        message: 'Meta title is too long (> 60 characters)',
        impact: 'medium'
      });
    }

    // Check description
    if (!metaDescription || metaDescription.length === 0) {
      issues.push({
        type: 'error',
        category: 'Meta Description',
        message: 'Missing meta description',
        impact: 'high'
      });
    } else if (metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too short (< 120 characters)',
        impact: 'medium'
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: 'Meta description is too long (> 160 characters)',
        impact: 'medium'
      });
    }

    // Check H1 tags
    if (technicalSEO.h1Count === 0) {
      issues.push({
        type: 'error',
        category: 'Headings',
        message: 'No H1 tag found',
        impact: 'high'
      });
    } else if (technicalSEO.h1Count > 1) {
      issues.push({
        type: 'warning',
        category: 'Headings',
        message: 'Multiple H1 tags found',
        impact: 'medium'
      });
    }

    // Calculate keyword density
    const keywordDensity = this.calculateKeywordDensity(content);
    
    // Calculate readability
    const readability = this.calculateReadability(content);
    
    // Generate suggestions
    if (technicalSEO.imageAltTags < 5) {
      suggestions.push({
        category: 'Images',
        suggestion: 'Add more images with descriptive alt tags',
        impact: 3,
        effort: 'low'
      });
    }

    if (technicalSEO.internalLinks < 3) {
      suggestions.push({
        category: 'Internal Linking',
        suggestion: 'Add more internal links to related content',
        impact: 4,
        effort: 'low'
      });
    }

    // Calculate overall score
    const score = this.calculateSEOScore(issues, readability, technicalSEO);

    return {
      score,
      issues,
      suggestions,
      keywordDensity,
      readability,
      technicalSEO
    };
  }

  private analyzeTechnicalSEO(content: string, title?: string, description?: string): TechnicalSEO {
    // Count H1 tags
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    
    // Count images with alt tags
    const imgMatches = content.match(/<img[^>]+alt="[^"]+"/gi) || [];
    
    // Count links
    const internalLinkMatches = content.match(/<a[^>]+href="\/[^"]*"/gi) || [];
    const externalLinkMatches = content.match(/<a[^>]+href="https?:\/\/[^"]*"/gi) || [];

    return {
      titleLength: title?.length || 0,
      descriptionLength: description?.length || 0,
      h1Count: h1Matches.length,
      imageAltTags: imgMatches.length,
      internalLinks: internalLinkMatches.length,
      externalLinks: externalLinkMatches.length
    };
  }

  private calculateKeywordDensity(content: string): Record<string, number> {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, ' ').toLowerCase();
    const words = textContent.match(/\b\w+\b/g) || [];
    
    const wordCount: Record<string, number> = {};
    const totalWords = words.length;

    // Count word frequency
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // Calculate density
    const density: Record<string, number> = {};
    Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 keywords
      .forEach(([word, count]) => {
        density[word] = Number(((count / totalWords) * 100).toFixed(2));
      });

    return density;
  }

  private calculateReadability(content: string): ReadabilityScore {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, ' ');
    
    // Basic readability metrics
    const sentences = textContent.match(/[.!?]+/g) || [];
    const words = textContent.match(/\b\w+\b/g) || [];
    const paragraphs = content.match(/<p[^>]*>.*?<\/p>/gi) || [];
    
    const avgSentenceLength = words.length / (sentences.length || 1);
    const avgParagraphLength = words.length / (paragraphs.length || 1);
    
    // Simple complexity based on word length
    const complexWords = words.filter(word => word.length > 6).length;
    const wordComplexity = (complexWords / words.length) * 100;
    
    // Passive voice detection (simplified)
    const passivePatterns = /\b(was|were|been|being|is|are|am)\s+\w+ed\b/gi;
    const passiveMatches = textContent.match(passivePatterns) || [];
    const passiveVoice = (passiveMatches.length / sentences.length) * 100;

    // Calculate score (simplified Flesch Reading Ease)
    const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * (complexWords / words.length);
    
    // Determine grade
    let grade = 'Very Easy';
    if (score < 30) grade = 'Very Difficult';
    else if (score < 50) grade = 'Difficult';
    else if (score < 60) grade = 'Fairly Difficult';
    else if (score < 70) grade = 'Standard';
    else if (score < 80) grade = 'Fairly Easy';
    else if (score < 90) grade = 'Easy';

    return {
      score: Math.max(0, Math.min(100, score)),
      grade,
      metrics: {
        sentenceLength: avgSentenceLength,
        wordComplexity,
        paragraphLength: avgParagraphLength,
        passiveVoice
      }
    };
  }

  private calculateSEOScore(
    issues: SEOIssue[], 
    readability: ReadabilityScore, 
    technicalSEO: TechnicalSEO
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      if (issue.type === 'error') {
        score -= issue.impact === 'high' ? 15 : 10;
      } else if (issue.type === 'warning') {
        score -= issue.impact === 'high' ? 10 : issue.impact === 'medium' ? 5 : 2;
      }
    });

    // Factor in readability
    if (readability.score < 30) score -= 10;
    else if (readability.score < 50) score -= 5;

    // Factor in technical SEO
    if (technicalSEO.h1Count !== 1) score -= 10;
    if (technicalSEO.internalLinks < 2) score -= 5;
    if (technicalSEO.imageAltTags === 0) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  async analyzeKeywords(keywords: string[]): Promise<any> {
    // In a real implementation, this would call an API like Ahrefs or SEMrush
    // For now, return mock data
    return keywords.map(keyword => ({
      term: keyword,
      searchVolume: Math.floor(Math.random() * 10000),
      difficulty: Math.floor(Math.random() * 100),
      cpc: Number((Math.random() * 5).toFixed(2)),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
    }));
  }
}

export const seoAnalyzer = new SEOAnalyzer();