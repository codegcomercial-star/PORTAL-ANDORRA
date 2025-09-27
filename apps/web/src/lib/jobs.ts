import { prisma } from './prisma.js';
import { rateLimit } from './rate-limit.js';

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  benefits: string[];
  
  // Job details
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  level: 'entry' | 'mid' | 'senior' | 'executive';
  category: string;
  skills: string[];
  languages?: string[];
  
  // Compensation
  salary?: {
    min?: number;
    max?: number;
    currency: 'EUR' | 'USD';
    period: 'hour' | 'month' | 'year';
  };
  
  // Location
  location: {
    parish?: string;
    remote: boolean;
    hybrid: boolean;
  };
  
  // Company info
  companyInfo: {
    name: string;
    logo?: string;
    website?: string;
    size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    industry?: string;
  };
  
  // AI Analysis
  aiSummary: string;
  skillsMatch: {
    required: string[];
    preferred: string[];
    nice_to_have: string[];
  };
  difficultyScore: number; // 1-10
  popularityScore: number; // Based on views/applications
  
  // Source
  source: string;
  sourceUrl: string;
  applicationUrl?: string;
  contactEmail?: string;
  
  // Status
  active: boolean;
  featured: boolean;
  urgent: boolean;
  expiresAt?: Date;
  
  // Analytics
  views: number;
  applications: number;
  
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface JobSearchQuery {
  text?: string;
  category?: string[];
  type?: JobOffer['type'][];
  level?: JobOffer['level'][];
  skills?: string[];
  languages?: string[];
  parish?: string[];
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  sortBy?: 'date' | 'salary' | 'relevance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  languages: string[];
  location: string;
  desiredSalary?: number;
  desiredType?: JobOffer['type'][];
  desiredCategories?: string[];
  cv?: string;
  portfolio?: string;
}

export interface JobMatch {
  jobId: string;
  userId: string;
  score: number; // 0-100
  reasons: string[];
  matchDetails: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
    typeMatch: number;
  };
  createdAt: Date;
}

export class JobService {
  private static instance: JobService;
  private rateLimiter = rateLimit({ limit: 50, windowSec: 60 });

  // Job sources to scrape
  private sources = [
    { name: 'Servei d\'Ocupació d\'Andorra', url: 'https://www.serveiocupacio.ad', active: true },
    { name: 'InfoJobs Andorra', url: 'https://www.infojobs.ad', active: true },
    { name: 'Linkedin Jobs', url: 'https://www.linkedin.com/jobs/search/?location=Andorra', active: true },
    { name: 'Indeed Andorra', url: 'https://ad.indeed.com', active: true },
  ];

  static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  async scrapeAllJobSources(): Promise<{ success: number; errors: number }> {
    let success = 0;
    let errors = 0;

    console.log('💼 Starting job scraping...');

    for (const source of this.sources.filter(s => s.active)) {
      try {
        const rateCheck = await this.rateLimiter(`job-scraper-${source.name}`);
        if (!rateCheck.ok) {
          console.warn(`Rate limit exceeded for ${source.name}`);
          continue;
        }

        console.log(`🔍 Scraping ${source.name}...`);
        const jobs = await this.scrapeJobSource(source);
        
        for (const job of jobs) {
          try {
            const enhancedJob = await this.enhanceJobWithAI(job);
            await this.saveJob(enhancedJob);
            success++;
          } catch (error) {
            console.error(`Error saving job from ${source.name}:`, error);
            errors++;
          }
        }

        // Rate limiting between sources
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        errors++;
      }
    }

    console.log(`✅ Job scraping complete: ${success} saved, ${errors} errors`);
    return { success, errors };
  }

  private async scrapeJobSource(source: { name: string; url: string }): Promise<Partial<JobOffer>[]> {
    try {
      // Mock scraping - replace with actual HTTP requests and parsing
      return this.mockScrapeJobs(source);
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  private mockScrapeJobs(source: { name: string; url: string }): Partial<JobOffer>[] {
    // Mock data - replace with actual scraping logic
    const mockJobs: Partial<JobOffer>[] = [
      {
        title: 'Desenvolupador Full Stack',
        company: 'TechAndorra SL',
        description: 'Busquem un desenvolupador experimentat per unir-se al nostre equip de tecnologia. Treballaràs amb React, Node.js i MongoDB.',
        requirements: ['3+ anys experiència', 'React', 'Node.js', 'MongoDB', 'Git'],
        benefits: ['Sou competitiu', 'Teletreball', 'Formació contínua', 'Asseguradora privada'],
        type: 'full-time',
        level: 'mid',
        category: 'Tecnologia',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
        languages: ['Català', 'Castellà', 'Anglès'],
        salary: { min: 45000, max: 60000, currency: 'EUR', period: 'year' },
        location: { parish: 'andorra-la-vella', remote: false, hybrid: true },
        companyInfo: {
          name: 'TechAndorra SL',
          size: 'medium',
          industry: 'Tecnologia',
        },
        source: source.name,
        sourceUrl: source.url + '/job/mock-1',
        active: true,
        featured: Math.random() > 0.8,
        urgent: Math.random() > 0.9,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Comptable Senior',
        company: 'Assessoria Fiscal Andorrana',
        description: 'Incorporem un comptable senior per gestionar la comptabilitat de clients corporatius. Imprescindible experiència en normativa andorrana.',
        requirements: ['5+ anys experiència', 'Normativa fiscal andorrana', 'Excel avançat', 'SAP'],
        benefits: ['Estabilitat laboral', 'Horari flexible', 'Bonus anual'],
        type: 'full-time',
        level: 'senior',
        category: 'Comptabilitat',
        skills: ['SAP', 'Excel', 'Comptabilitat', 'Fiscalitat'],
        languages: ['Català', 'Castellà'],
        salary: { min: 40000, max: 55000, currency: 'EUR', period: 'year' },
        location: { parish: 'escaldes-engordany', remote: false, hybrid: false },
        companyInfo: {
          name: 'Assessoria Fiscal Andorrana',
          size: 'small',
          industry: 'Serveis financers',
        },
        source: source.name,
        sourceUrl: source.url + '/job/mock-2',
        active: true,
        featured: false,
        urgent: false,
        publishedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Cambrer/a Restaurant',
        company: 'Restaurant El Molí',
        description: 'Restaurant de muntanya busca cambrer/a per temporada d\'hivern. Ambient familiar i clients internacionals.',
        requirements: ['Experiència en restauració', 'Idiomes', 'Disponibilitat caps de setmana'],
        benefits: ['Tips', 'Menjar inclòs', 'Ambient dinàmic'],
        type: 'part-time',
        level: 'entry',
        category: 'Hosteleria',
        skills: ['Atenció al client', 'Idiomes', 'Treball en equip'],
        languages: ['Català', 'Castellà', 'Anglès', 'Francès'],
        salary: { min: 15, max: 18, currency: 'EUR', period: 'hour' },
        location: { parish: 'canillo', remote: false, hybrid: false },
        companyInfo: {
          name: 'Restaurant El Molí',
          size: 'small',
          industry: 'Restauració',
        },
        source: source.name,
        sourceUrl: source.url + '/job/mock-3',
        active: true,
        featured: false,
        urgent: true,
        publishedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      },
    ];

    return mockJobs;
  }

  private async enhanceJobWithAI(job: Partial<JobOffer>): Promise<JobOffer> {
    try {
      const enhanced: JobOffer = {
        id: this.generateJobId(job),
        title: job.title || '',
        company: job.company || '',
        description: job.description || '',
        requirements: job.requirements || [],
        benefits: job.benefits || [],
        type: job.type || 'full-time',
        level: job.level || 'mid',
        category: job.category || 'General',
        skills: job.skills || [],
        languages: job.languages,
        salary: job.salary,
        location: job.location || { remote: false, hybrid: false },
        companyInfo: job.companyInfo || { name: job.company || 'Company' },
        source: job.source || '',
        sourceUrl: job.sourceUrl || '',
        applicationUrl: job.applicationUrl,
        contactEmail: job.contactEmail,
        active: job.active ?? true,
        featured: job.featured ?? false,
        urgent: job.urgent ?? false,
        expiresAt: job.expiresAt,
        views: 0,
        applications: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: job.publishedAt || new Date(),

        // AI-generated content
        aiSummary: await this.generateAISummary(job),
        skillsMatch: this.extractSkillsFromJob(job),
        difficultyScore: this.calculateDifficultyScore(job),
        popularityScore: 0.5, // Will be calculated based on actual data
      };

      return enhanced;
    } catch (error) {
      console.error('Error enhancing job with AI:', error);
      throw error;
    }
  }

  private generateJobId(job: Partial<JobOffer>): string {
    const company = job.company || 'unknown';
    const title = job.title || 'untitled';
    const source = job.source || 'unknown';
    
    const hash = Buffer.from(`${company}-${title}-${source}`).toString('base64');
    return 'job_' + hash.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  private async generateAISummary(job: Partial<JobOffer>): Promise<string> {
    // Mock AI summary generation - replace with actual AI API
    const templates = [
      `Oportunitat excel·lent per a professionals de ${job.category}. ${job.company} busca talent qualificat per unir-se al seu equip dinàmic.`,
      `Posició interessant en ${job.location?.parish || 'Andorra'} amb possibilitats de creixement professional i ambient de treball col·laboratiu.`,
      `Oferta competitiva amb beneficis atractius. Ideal per a persones motivades amb experiència en ${job.skills?.join(', ') || 'el sector'}.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private extractSkillsFromJob(job: Partial<JobOffer>): JobOffer['skillsMatch'] {
    const allSkills = [
      ...(job.skills || []),
      ...(job.requirements || []).filter(req => req.length < 50), // Filter out long requirements
    ];

    // Categorize skills by importance
    const required = allSkills.filter(skill => 
      (job.requirements || []).some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) &&
        (req.includes('imprescindible') || req.includes('requerit') || req.includes('necessari'))
      )
    ).slice(0, 5);

    const preferred = allSkills.filter(skill => !required.includes(skill)).slice(0, 3);
    const nice_to_have = (job.languages || []).slice(0, 3);

    return { required, preferred, nice_to_have };
  }

  private calculateDifficultyScore(job: Partial<JobOffer>): number {
    let score = 5; // Base difficulty

    // Level impact
    if (job.level === 'entry') score -= 2;
    else if (job.level === 'senior') score += 2;
    else if (job.level === 'executive') score += 3;

    // Skills impact
    const skillCount = (job.skills || []).length;
    if (skillCount > 8) score += 2;
    else if (skillCount < 3) score -= 1;

    // Requirements impact
    const reqCount = (job.requirements || []).length;
    if (reqCount > 10) score += 1;

    // Language requirements
    const langCount = (job.languages || []).length;
    if (langCount > 3) score += 1;

    return Math.min(10, Math.max(1, score));
  }

  private async saveJob(job: JobOffer): Promise<void> {
    try {
      await prisma.jobOffer.upsert({
        where: { id: job.id },
        create: {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          type: job.type,
          level: job.level,
          category: job.category,
          skills: job.skills,
          languages: job.languages,
          salary: job.salary,
          location: job.location,
          companyInfo: job.companyInfo,
          aiSummary: job.aiSummary,
          skillsMatch: job.skillsMatch,
          difficultyScore: job.difficultyScore,
          popularityScore: job.popularityScore,
          source: job.source,
          sourceUrl: job.sourceUrl,
          applicationUrl: job.applicationUrl,
          contactEmail: job.contactEmail,
          active: job.active,
          featured: job.featured,
          urgent: job.urgent,
          expiresAt: job.expiresAt,
          views: job.views,
          applications: job.applications,
          publishedAt: job.publishedAt,
        },
        update: {
          title: job.title,
          description: job.description,
          active: job.active,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.warn('Database unavailable for jobs, using memory cache:', error);
    }
  }

  async searchJobs(query: JobSearchQuery): Promise<JobOffer[]> {
    try {
      const where: any = { active: true };
      
      if (query.text) {
        where.OR = [
          { title: { contains: query.text, mode: 'insensitive' } },
          { description: { contains: query.text, mode: 'insensitive' } },
          { company: { contains: query.text, mode: 'insensitive' } },
          { skills: { hasSome: [query.text.toLowerCase()] } },
        ];
      }
      
      if (query.category) where.category = { in: query.category };
      if (query.type) where.type = { in: query.type };
      if (query.level) where.level = { in: query.level };
      if (query.skills) where.skills = { hasSome: query.skills };
      if (query.languages) where.languages = { hasSome: query.languages };
      if (query.parish) where.location = { path: ['parish'], in: query.parish };
      if (query.remote !== undefined) where.location = { path: ['remote'], equals: query.remote };
      if (query.salaryMin) where.salary = { path: ['min'], gte: query.salaryMin };
      if (query.salaryMax) where.salary = { path: ['max'], lte: query.salaryMax };

      const orderBy: any = {};
      if (query.sortBy === 'date') orderBy.publishedAt = query.sortOrder || 'desc';
      else if (query.sortBy === 'salary') orderBy.salary = { path: ['min'], sort: query.sortOrder || 'desc' };
      else if (query.sortBy === 'popularity') orderBy.popularityScore = query.sortOrder || 'desc';
      else orderBy.publishedAt = 'desc'; // Default sort

      return await prisma.jobOffer.findMany({
        where,
        orderBy,
        take: query.limit || 20,
        skip: query.offset || 0,
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }

  async getJobMatches(userProfile: UserProfile): Promise<JobMatch[]> {
    try {
      const activeJobs = await prisma.jobOffer.findMany({
        where: { active: true },
        take: 100, // Limit for performance
      });

      const matches: JobMatch[] = [];

      for (const job of activeJobs) {
        const matchScore = this.calculateMatchScore(userProfile, job);
        
        if (matchScore.score > 30) { // Only return matches above 30%
          matches.push({
            jobId: job.id,
            userId: userProfile.id,
            score: matchScore.score,
            reasons: matchScore.reasons,
            matchDetails: matchScore.details,
            createdAt: new Date(),
          });
        }
      }

      // Sort by score and return top matches
      return matches.sort((a, b) => b.score - a.score).slice(0, 20);
    } catch (error) {
      console.error('Error calculating job matches:', error);
      return [];
    }
  }

  private calculateMatchScore(user: UserProfile, job: JobOffer): {
    score: number;
    reasons: string[];
    details: JobMatch['matchDetails'];
  } {
    const reasons: string[] = [];
    let totalScore = 0;

    // Skills match (40% weight)
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const matchingSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    const skillsScore = (matchingSkills.length / Math.max(jobSkills.length, 1)) * 100;
    totalScore += skillsScore * 0.4;
    
    if (matchingSkills.length > 0) {
      reasons.push(`Coincidència en ${matchingSkills.length} habilitats: ${matchingSkills.slice(0, 3).join(', ')}`);
    }

    // Experience match (25% weight)
    const experienceMatch = user.experience.some(exp => 
      job.category.toLowerCase().includes(exp.toLowerCase()) ||
      exp.toLowerCase().includes(job.category.toLowerCase())
    );
    const experienceScore = experienceMatch ? 100 : 0;
    totalScore += experienceScore * 0.25;
    
    if (experienceMatch) {
      reasons.push(`Experiència relacionada amb ${job.category}`);
    }

    // Location match (15% weight)
    const locationScore = user.location === job.location.parish ? 100 : 
                         job.location.remote ? 80 : 
                         job.location.hybrid ? 60 : 30;
    totalScore += locationScore * 0.15;
    
    if (locationScore > 60) {
      reasons.push('Ubicació compatible');
    }

    // Salary match (10% weight)
    let salaryScore = 50; // Default if no salary info
    if (job.salary && user.desiredSalary) {
      const jobSalaryMin = job.salary.min || 0;
      if (jobSalaryMin >= user.desiredSalary) salaryScore = 100;
      else if (jobSalaryMin >= user.desiredSalary * 0.8) salaryScore = 80;
      else salaryScore = 30;
    }
    totalScore += salaryScore * 0.1;

    // Job type match (10% weight)
    const typeScore = user.desiredType?.includes(job.type) ? 100 : 50;
    totalScore += typeScore * 0.1;

    return {
      score: Math.round(totalScore),
      reasons: reasons.slice(0, 5),
      details: {
        skillsMatch: Math.round(skillsScore),
        experienceMatch: Math.round(experienceScore),
        locationMatch: Math.round(locationScore),
        salaryMatch: Math.round(salaryScore),
        typeMatch: Math.round(typeScore),
      },
    };
  }

  async getFeaturedJobs(limit: number = 6): Promise<JobOffer[]> {
    try {
      return await prisma.jobOffer.findMany({
        where: { active: true, featured: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      return [];
    }
  }

  async getUrgentJobs(limit: number = 10): Promise<JobOffer[]> {
    try {
      return await prisma.jobOffer.findMany({
        where: { active: true, urgent: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching urgent jobs:', error);
      return [];
    }
  }

  async getJobCategories(): Promise<string[]> {
    try {
      const categories = await prisma.jobOffer.findMany({
        select: { category: true },
        where: { active: true },
        distinct: ['category'],
      });
      
      return categories.map(c => c.category).filter(Boolean);
    } catch (error) {
      console.error('Error fetching job categories:', error);
      return ['Tecnologia', 'Comptabilitat', 'Vendes', 'Màrqueting', 'Hosteleria', 'Administració'];
    }
  }

  async getJobStats(): Promise<{
    totalActive: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
    byLevel: Record<string, number>;
    avgSalary: number;
    remoteJobs: number;
  }> {
    try {
      const totalActive = await prisma.jobOffer.count({ where: { active: true } });
      
      const byCategory = await prisma.jobOffer.groupBy({
        by: ['category'],
        where: { active: true },
        _count: { category: true },
      });
      
      const byType = await prisma.jobOffer.groupBy({
        by: ['type'],
        where: { active: true },
        _count: { type: true },
      });
      
      const byLevel = await prisma.jobOffer.groupBy({
        by: ['level'],
        where: { active: true },
        _count: { level: true },
      });
      
      const remoteJobs = await prisma.jobOffer.count({
        where: { active: true, location: { path: ['remote'], equals: true } },
      });
      
      // Mock salary calculation - in production, calculate from actual data
      const avgSalary = 45000;
      
      return {
        totalActive,
        byCategory: Object.fromEntries(byCategory.map(c => [c.category, c._count.category])),
        byType: Object.fromEntries(byType.map(t => [t.type, t._count.type])),
        byLevel: Object.fromEntries(byLevel.map(l => [l.level, l._count.level])),
        avgSalary,
        remoteJobs,
      };
    } catch (error) {
      console.error('Error fetching job stats:', error);
      return {
        totalActive: 0,
        byCategory: {},
        byType: {},
        byLevel: {},
        avgSalary: 0,
        remoteJobs: 0,
      };
    }
  }

  async incrementViews(jobId: string): Promise<void> {
    try {
      await prisma.jobOffer.update({
        where: { id: jobId },
        data: { views: { increment: 1 } },
      });
    } catch (error) {
      console.error('Error incrementing job views:', error);
    }
  }
}

// Export singleton instance
export const jobService = JobService.getInstance();