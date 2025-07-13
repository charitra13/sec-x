import { NextResponse } from 'next/server';
import { IBlog } from '@/types';

// Mock blog data (same as in the main blogs route)
const mockBlogs: IBlog[] = [
  {
    _id: '1',
    title: 'Advanced Red Team Techniques for Modern Infrastructure',
    slug: 'advanced-red-team-techniques-modern-infrastructure',
    excerpt: 'Explore cutting-edge red team methodologies and tactics used to assess modern enterprise security postures.',
    content: `<h2>Introduction</h2>
<p>Red teaming has evolved significantly over the past decade, adapting to new technologies and security measures. This comprehensive guide explores the latest techniques and methodologies used by security professionals to assess organizational security postures.</p>

<h2>Modern Infrastructure Challenges</h2>
<p>Today's enterprise environments present unique challenges for red team operations:</p>
<ul>
<li>Cloud-native architectures with complex networking</li>
<li>Zero-trust security models</li>
<li>Advanced endpoint detection and response (EDR) solutions</li>
<li>Container and microservices architectures</li>
</ul>

<h2>Advanced Techniques</h2>
<p>Our research has identified several advanced techniques that prove effective in modern environments:</p>

<h3>1. Living Off The Land (LOTL) Attacks</h3>
<p>Utilizing legitimate system tools and processes to avoid detection while maintaining persistence and achieving objectives.</p>

<h3>2. Cloud-Specific Attack Vectors</h3>
<p>Exploiting cloud service misconfigurations and identity management weaknesses to gain unauthorized access.</p>

<h3>3. Supply Chain Infiltration</h3>
<p>Targeting third-party dependencies and software supply chains to establish initial access.</p>

<h2>Defensive Considerations</h2>
<p>Understanding these techniques helps organizations better defend against sophisticated threats and improve their security posture.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Red Teaming',
    tags: ['red-team', 'penetration-testing', 'security-assessment', 'advanced-techniques'],
    status: 'published',
    likes: [],
    shares: { total: 45, twitter: 20, facebook: 10, linkedin: 15, whatsapp: 0 },
    seo: {
      metaTitle: 'Advanced Red Team Techniques for Modern Infrastructure',
      metaDescription: 'Explore cutting-edge red team methodologies and tactics used to assess modern enterprise security postures.',
      metaKeywords: ['red team', 'penetration testing', 'security assessment', 'cybersecurity']
    },
    isFeature: true,
    author: {
      _id: '1',
      name: 'Alex Rodriguez',
      email: 'alex@securityx.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      newsletter: true,
      isEmailVerified: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    readingTime: 8,
    views: 1250,
    commentsCount: 15
  },
  {
    _id: '2',
    title: 'AI Security: Protecting Machine Learning Models from Adversarial Attacks',
    slug: 'ai-security-protecting-ml-models-adversarial-attacks',
    excerpt: 'Learn how to secure AI systems against sophisticated adversarial attacks and implement robust defense mechanisms.',
    content: `<h2>The Growing Threat Landscape</h2>
<p>As artificial intelligence becomes increasingly integrated into critical business operations, the security of AI systems has become paramount. Adversarial attacks against machine learning models pose significant risks to organizations deploying AI solutions.</p>

<h2>Types of Adversarial Attacks</h2>
<p>Understanding the various attack vectors is crucial for implementing effective defenses:</p>

<h3>1. Evasion Attacks</h3>
<p>Malicious inputs designed to fool trained models during inference, causing misclassification or incorrect predictions.</p>

<h3>2. Poisoning Attacks</h3>
<p>Contaminating training data to influence model behavior and create backdoors for future exploitation.</p>

<h3>3. Model Extraction</h3>
<p>Stealing proprietary models through query-based attacks and reverse engineering techniques.</p>

<h2>Defense Strategies</h2>
<p>Implementing comprehensive security measures to protect AI systems:</p>
<ul>
<li>Adversarial training with robust datasets</li>
<li>Input validation and sanitization</li>
<li>Model monitoring and anomaly detection</li>
<li>Differential privacy techniques</li>
</ul>

<h2>Best Practices</h2>
<p>Organizations should adopt a multi-layered approach to AI security, combining technical controls with governance frameworks and continuous monitoring.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'AI Security',
    tags: ['ai-security', 'machine-learning', 'adversarial-attacks', 'defense-mechanisms'],
    status: 'published',
    likes: [],
    shares: { total: 67, twitter: 30, facebook: 15, linkedin: 22, whatsapp: 0 },
    seo: {
      metaTitle: 'AI Security: Protecting Machine Learning Models from Adversarial Attacks',
      metaDescription: 'Learn how to secure AI systems against sophisticated adversarial attacks and implement robust defense mechanisms.',
      metaKeywords: ['ai security', 'machine learning', 'adversarial attacks', 'cybersecurity']
    },
    isFeature: true,
    author: {
      _id: '2',
      name: 'Dr. Sarah Chen',
      email: 'sarah@securityx.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6e6b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      newsletter: true,
      isEmailVerified: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    readingTime: 12,
    views: 2100,
    commentsCount: 28
  },
  {
    _id: '3',
    title: 'Zero Trust Architecture: Implementation Guide for Enterprise Security',
    slug: 'zero-trust-architecture-implementation-guide',
    excerpt: 'A comprehensive guide to implementing zero trust security principles in enterprise environments.',
    content: `<h2>Understanding Zero Trust</h2>
<p>Zero Trust is a security framework that requires all users, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated before being granted access to applications and data.</p>

<h2>Core Principles</h2>
<p>The foundation of Zero Trust architecture rests on several key principles:</p>

<h3>1. Never Trust, Always Verify</h3>
<p>Every access request must be authenticated and authorized, regardless of location or previous access history.</p>

<h3>2. Least Privilege Access</h3>
<p>Users and systems should only have access to the resources they absolutely need to perform their functions.</p>

<h3>3. Assume Breach</h3>
<p>Design systems with the assumption that threats may already be present within the network.</p>

<h2>Implementation Strategy</h2>
<p>Successfully implementing Zero Trust requires a phased approach:</p>
<ol>
<li><strong>Asset Discovery:</strong> Identify and catalog all resources, users, and data flows</li>
<li><strong>Risk Assessment:</strong> Evaluate current security posture and identify vulnerabilities</li>
<li><strong>Policy Development:</strong> Create comprehensive access policies and controls</li>
<li><strong>Technology Deployment:</strong> Implement necessary security tools and platforms</li>
<li><strong>Continuous Monitoring:</strong> Establish ongoing visibility and threat detection</li>
</ol>

<h2>Key Technologies</h2>
<p>Essential components for Zero Trust implementation:</p>
<ul>
<li>Identity and Access Management (IAM)</li>
<li>Multi-Factor Authentication (MFA)</li>
<li>Privileged Access Management (PAM)</li>
<li>Network Segmentation</li>
<li>Endpoint Detection and Response (EDR)</li>
</ul>`,
    coverImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Security Architecture',
    tags: ['zero-trust', 'enterprise-security', 'access-control', 'network-security'],
    status: 'published',
    likes: [],
    shares: { total: 52, twitter: 25, facebook: 12, linkedin: 15, whatsapp: 0 },
    seo: {
      metaTitle: 'Zero Trust Architecture: Implementation Guide for Enterprise Security',
      metaDescription: 'A comprehensive guide to implementing zero trust security principles in enterprise environments.',
      metaKeywords: ['zero trust', 'enterprise security', 'access control', 'network security']
    },
    isFeature: false,
    author: {
      _id: '3',
      name: 'Michael Thompson',
      email: 'michael@securityx.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      newsletter: true,
      isEmailVerified: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05'),
    readingTime: 15,
    views: 1850,
    commentsCount: 22
  },
  {
    _id: '4',
    title: 'Penetration Testing Methodologies: From Reconnaissance to Reporting',
    slug: 'penetration-testing-methodologies-reconnaissance-reporting',
    excerpt: 'Master the complete penetration testing lifecycle with proven methodologies and best practices.',
    content: `<h2>Introduction to Penetration Testing</h2>
<p>Penetration testing is a systematic approach to evaluating the security of an organization's systems, networks, and applications by simulating real-world attacks. This comprehensive methodology helps identify vulnerabilities before malicious actors can exploit them.</p>

<h2>The Penetration Testing Lifecycle</h2>
<p>A successful penetration test follows a structured approach:</p>

<h3>1. Planning and Scoping</h3>
<p>Define objectives, scope, and rules of engagement. Establish clear boundaries and obtain necessary approvals.</p>

<h3>2. Reconnaissance</h3>
<p>Gather information about the target environment using both passive and active techniques:</p>
<ul>
<li>Open Source Intelligence (OSINT)</li>
<li>Network scanning and enumeration</li>
<li>Social engineering reconnaissance</li>
<li>Physical security assessment</li>
</ul>

<h3>3. Vulnerability Assessment</h3>
<p>Identify potential security weaknesses through automated scanning and manual testing techniques.</p>

<h3>4. Exploitation</h3>
<p>Attempt to exploit identified vulnerabilities to gain unauthorized access or demonstrate impact.</p>

<h3>5. Post-Exploitation</h3>
<p>Assess the extent of compromise and potential for lateral movement within the environment.</p>

<h3>6. Reporting</h3>
<p>Document findings, provide risk ratings, and recommend remediation strategies.</p>

<h2>Testing Methodologies</h2>
<p>Industry-standard frameworks guide penetration testing activities:</p>
<ul>
<li><strong>OWASP Testing Guide:</strong> Web application security testing</li>
<li><strong>NIST SP 800-115:</strong> Technical guide to information security testing</li>
<li><strong>PTES:</strong> Penetration Testing Execution Standard</li>
<li><strong>OSSTMM:</strong> Open Source Security Testing Methodology Manual</li>
</ul>

<h2>Best Practices</h2>
<p>Ensuring effective and safe penetration testing:</p>
<ul>
<li>Maintain detailed documentation throughout the process</li>
<li>Follow responsible disclosure practices</li>
<li>Prioritize findings based on business impact</li>
<li>Provide actionable remediation guidance</li>
</ul>`,
    coverImage: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    category: 'Penetration Testing',
    tags: ['penetration-testing', 'vulnerability-assessment', 'security-testing', 'methodology'],
    status: 'published',
    likes: [],
    shares: { total: 38, twitter: 18, facebook: 8, linkedin: 12, whatsapp: 0 },
    seo: {
      metaTitle: 'Penetration Testing Methodologies: From Reconnaissance to Reporting',
      metaDescription: 'Master the complete penetration testing lifecycle with proven methodologies and best practices.',
      metaKeywords: ['penetration testing', 'vulnerability assessment', 'security testing', 'methodology']
    },
    isFeature: false,
    author: {
      _id: '4',
      name: 'Jessica Martinez',
      email: 'jessica@securityx.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      newsletter: true,
      isEmailVerified: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    readingTime: 10,
    views: 1650,
    commentsCount: 18
  },
  {
    _id: '5',
    title: 'Cloud Security Best Practices: Securing Multi-Cloud Environments',
    slug: 'cloud-security-best-practices-multi-cloud-environments',
    excerpt: 'Essential strategies for maintaining security across complex multi-cloud infrastructure deployments.',
    content: `<h2>The Multi-Cloud Challenge</h2>
<p>Organizations increasingly adopt multi-cloud strategies to avoid vendor lock-in, improve resilience, and optimize costs. However, this approach introduces complex security challenges that require specialized expertise and tools.</p>

<h2>Key Security Challenges</h2>
<p>Multi-cloud environments present unique security considerations:</p>

<h3>1. Inconsistent Security Models</h3>
<p>Different cloud providers have varying security controls, APIs, and management interfaces.</p>

<h3>2. Complex Identity Management</h3>
<p>Managing identities and access across multiple cloud platforms requires sophisticated orchestration.</p>

<h3>3. Data Governance</h3>
<p>Ensuring consistent data protection and compliance across diverse cloud environments.</p>

<h2>Security Best Practices</h2>
<p>Implementing comprehensive security across multi-cloud environments:</p>

<h3>1. Unified Identity and Access Management</h3>
<ul>
<li>Implement single sign-on (SSO) across all cloud platforms</li>
<li>Use centralized identity providers</li>
<li>Enforce multi-factor authentication</li>
<li>Implement just-in-time access controls</li>
</ul>

<h3>2. Consistent Security Policies</h3>
<ul>
<li>Develop cloud-agnostic security policies</li>
<li>Implement infrastructure as code (IaC) for consistent deployments</li>
<li>Use policy-as-code frameworks</li>
<li>Establish security baselines and templates</li>
</ul>

<h3>3. Comprehensive Monitoring</h3>
<ul>
<li>Deploy cloud security posture management (CSPM) tools</li>
<li>Implement centralized logging and monitoring</li>
<li>Use cloud workload protection platforms (CWPP)</li>
<li>Establish security information and event management (SIEM)</li>
</ul>

<h2>Compliance and Governance</h2>
<p>Maintaining compliance across multiple cloud environments requires:</p>
<ul>
<li>Regular security assessments and audits</li>
<li>Automated compliance monitoring</li>
<li>Data classification and protection</li>
<li>Incident response planning</li>
</ul>`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    category: 'Cloud',
    tags: ['cloud-security', 'multi-cloud', 'security-best-practices', 'compliance'],
    status: 'published',
    likes: [],
    shares: { total: 29, twitter: 15, facebook: 6, linkedin: 8, whatsapp: 0 },
    seo: {
      metaTitle: 'Cloud Security Best Practices: Securing Multi-Cloud Environments',
      metaDescription: 'Essential strategies for maintaining security across complex multi-cloud infrastructure deployments.',
      metaKeywords: ['cloud security', 'multi-cloud', 'security best practices', 'compliance']
    },
    isFeature: false,
    author: {
      _id: '5',
      name: 'David Kumar',
      email: 'david@securityx.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      newsletter: true,
      isEmailVerified: true,
      isActive: true
    },
    publishedAt: new Date('2023-12-28'),
    createdAt: new Date('2023-12-28'),
    readingTime: 11,
    views: 1420,
    commentsCount: 12
  }
];

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Find the blog post by slug
    const blog = mockBlogs.find(b => b.slug === slug);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Simulate API response structure that the frontend expects
    const response = {
      success: true,
      data: blog
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
} 