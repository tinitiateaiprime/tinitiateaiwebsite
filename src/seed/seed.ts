import type { Payload } from 'payload'
import type { Course } from '@/payload-types'
import { richTextFromParagraphs } from './richText'

type CourseTags = NonNullable<Course['tags']>

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(10, 0, 0, 0)
  return d.toISOString()
}

export async function seedDatabase(payload: Payload) {
  payload.logger.info('Seeding TinitiateAI placeholder content...')

  // --- Site settings ---
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'TinitiateAI',
      tagline: 'Practical IT & AI Training for Real Careers',
      contactPhone: '+91 90000 12345',
      contactEmail: 'hello@tinitiateai.com',
      address: 'HITEC City, Hyderabad, Telangana, India',
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'YouTube', url: 'https://youtube.com' },
        { platform: 'Instagram', url: 'https://instagram.com' },
      ],
      studentsPlaced: 1240,
      coursesOffered: 17,
      hiringPartners: 65,
    },
  })

  // --- Staff admin user (idempotent) ---
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@tinitiateai.com' } },
    limit: 1,
  })
  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'TinitiateAI Admin',
        email: 'admin@tinitiateai.com',
        password: 'ChangeMe123!',
        role: 'admin',
      },
    })
  }

  // --- Categories ---
  const categoryDefs = [
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Our flagship end-to-end program: data science, statistics, machine learning, and deep learning.' },
    { name: 'Generative AI', slug: 'generative-ai', description: 'LLMs, prompt engineering, and AI agent development.' },
    { name: 'Machine Learning', slug: 'machine-learning', description: 'Core ML algorithms and applied Python.' },
    { name: 'Data Science', slug: 'data-science', description: 'Statistics, analytics, and end-to-end data projects.' },
    { name: 'MLOps & Cloud AI', slug: 'mlops-cloud-ai', description: 'Deploying and scaling AI systems in production.' },
    { name: 'Deep Learning & NLP', slug: 'deep-learning-nlp', description: 'Neural networks, computer vision, and language models.' },
    { name: 'AI for Business', slug: 'ai-for-business', description: 'AI strategy and adoption for non-technical leaders.' },
    { name: 'Full Stack Java', slug: 'full-stack-java', description: 'Core Java, Spring Boot, and full-stack web development.' },
    { name: 'Full Stack .NET', slug: 'full-stack-dotnet', description: '.NET Core, C#, and full-stack enterprise development.' },
    { name: 'Full Stack Web Development', slug: 'full-stack-web', description: 'Modern frontend development with React and JavaScript.' },
    { name: 'Software Testing', slug: 'software-testing', description: 'Manual and automated testing for real-world QA roles.' },
    { name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'CI/CD, containers, and multi-cloud infrastructure.' },
  ]
  const categories: Record<string, number> = {}
  for (const def of categoryDefs) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: def.slug } }, limit: 1 })
    const doc = existing.totalDocs > 0
      ? existing.docs[0]
      : await payload.create({ collection: 'categories', data: def })
    categories[def.slug] = doc.id
  }

  // --- Trainers ---
  const trainerDefs = [
    {
      name: 'Ananya Rao',
      slug: 'ananya-rao',
      title: 'Senior Generative AI Engineer',
      yearsExperience: 9,
      expertise: [{ skill: 'LLMs' }, { skill: 'LangChain' }, { skill: 'Prompt Engineering' }, { skill: 'AI Agents' }],
      bio: richTextFromParagraphs([
        'Ananya has spent the last 9 years building production ML systems, and the last 3 focused entirely on generative AI applications for fintech and healthcare clients.',
        'She previously led the applied AI team at a Series C startup and has trained over 2,000 engineers on LLM application development.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Vikram Sharma',
      slug: 'vikram-sharma',
      title: 'Lead Data Scientist',
      yearsExperience: 11,
      expertise: [{ skill: 'Python' }, { skill: 'Statistics' }, { skill: 'scikit-learn' }, { skill: 'A/B Testing' }],
      bio: richTextFromParagraphs([
        'Vikram has 11 years of experience across e-commerce and banking, building forecasting and recommendation systems used by millions of users.',
        'He is passionate about teaching data science fundamentals in a way that translates directly into job-ready skills.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Priya Menon',
      slug: 'priya-menon',
      title: 'MLOps Architect',
      yearsExperience: 8,
      expertise: [{ skill: 'AWS SageMaker' }, { skill: 'Azure ML' }, { skill: 'Kubernetes' }, { skill: 'CI/CD' }],
      bio: richTextFromParagraphs([
        'Priya designs the infrastructure that takes machine learning models from notebooks to reliable, monitored production systems.',
        'She consults for enterprises rolling out AI at scale and brings that real-world context into every cohort.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Rahul Nair',
      slug: 'rahul-nair',
      title: 'Deep Learning Researcher',
      yearsExperience: 7,
      expertise: [{ skill: 'PyTorch' }, { skill: 'Computer Vision' }, { skill: 'Transformers' }, { skill: 'NLP' }],
      bio: richTextFromParagraphs([
        'Rahul holds a research background in computer vision and has published work on transformer architectures for multimodal tasks.',
        'He focuses on making deep learning approachable without skipping the math that actually matters.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Kiran Kumar',
      slug: 'kiran-kumar',
      title: 'Senior Full Stack Java Trainer',
      yearsExperience: 10,
      expertise: [{ skill: 'Java' }, { skill: 'Spring Boot' }, { skill: 'Microservices' }, { skill: 'SQL' }],
      bio: richTextFromParagraphs([
        'Kiran has spent a decade building enterprise Java applications before moving into full-time training.',
        'He focuses on the patterns and practices that show up in real Java interviews and production codebases.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Sudhakar Reddy',
      slug: 'sudhakar-reddy',
      title: '.NET Core Architect',
      yearsExperience: 9,
      expertise: [{ skill: 'C#' }, { skill: '.NET Core' }, { skill: 'Azure' }, { skill: 'SQL Server' }],
      bio: richTextFromParagraphs([
        'Sudhakar has architected .NET systems for enterprise clients across banking and retail.',
        'He brings a strong focus on clean architecture and testable code into every batch.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Divya Nair',
      slug: 'divya-nair',
      title: 'Frontend Engineering Lead',
      yearsExperience: 8,
      expertise: [{ skill: 'React' }, { skill: 'JavaScript' }, { skill: 'TypeScript' }, { skill: 'UI/UX' }],
      bio: richTextFromParagraphs([
        'Divya has led frontend teams shipping consumer-facing products used by millions of users.',
        'She teaches React the way it is actually used on real product teams, not just in tutorials.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
    {
      name: 'Arun Prakash',
      slug: 'arun-prakash',
      title: 'QA & Test Automation Lead',
      yearsExperience: 8,
      expertise: [{ skill: 'Selenium' }, { skill: 'Manual Testing' }, { skill: 'API Testing' }, { skill: 'Playwright' }],
      bio: richTextFromParagraphs([
        'Arun has led QA teams across product and services companies, from manual test plans to full automation suites.',
        'He trains students to think like testers first and automate second.',
      ]),
      linkedIn: 'https://linkedin.com',
    },
  ]
  const trainers: Record<string, number> = {}
  for (const def of trainerDefs) {
    const existing = await payload.find({ collection: 'trainers', where: { slug: { equals: def.slug } }, limit: 1 })
    const doc = existing.totalDocs > 0
      ? existing.docs[0]
      : await payload.create({ collection: 'trainers', data: def })
    trainers[def.slug] = doc.id
  }

  // --- Courses ---
  const courseDefs = [
    {
      title: 'Artificial Intelligence Training',
      slug: 'artificial-intelligence-training',
      category: categories['artificial-intelligence'],
      trainer: trainers['vikram-sharma'],
      level: 'beginner' as const,
      duration: '16 weeks',
      price: 55000,
      discountedPrice: 47000,
      featured: true,
      rating: 5,
      startDate: addDays(17),
      shortDescription: 'Our flagship program: go from data fundamentals to deep learning and TensorFlow, end to end.',
      description: richTextFromParagraphs([
        'This is our most comprehensive program, designed for people starting from the ground up who want a complete path into AI — not just one narrow slice of it.',
        'You will build a foundation in data science and statistics, get hands-on with Python and classical machine learning, then move into neural networks, computer vision, and sequence models with TensorFlow and Keras.',
        'Every stage includes real datasets and projects, so by the end you have both the theory and a portfolio that demonstrates it.',
      ]),
      keyFeatures: [
        { feature: 'Hands-on projects using real-world datasets at every stage of the program' },
        { feature: 'Live, instructor-led sessions with recordings provided for revision' },
        { feature: 'Covers the full stack in one program: data science, classical ML, and deep learning' },
        { feature: 'Interview preparation, mock interviews, and resume support' },
        { feature: 'Placement assistance through our hiring partner network' },
      ],
      tools: [
        { tool: 'Python' },
        { tool: 'NumPy' },
        { tool: 'Pandas' },
        { tool: 'Scikit-learn' },
        { tool: 'Hadoop' },
        { tool: 'Apache Spark' },
        { tool: 'PySpark' },
        { tool: 'TensorFlow' },
        { tool: 'Keras' },
        { tool: 'TFLearn' },
      ],
      targetAudience: [
        { audience: 'Aspiring data scientists and machine learning engineers' },
        { audience: 'Software developers looking to transition into AI' },
        { audience: 'Final-year engineering and computer science students' },
        { audience: 'Working professionals seeking a structured path into an AI career' },
      ],
      curriculum: [
        {
          moduleTitle: '1. Introduction to Data Science & Deep Learning',
          topics: [
            { topic: 'Deep learning overview and AI fundamentals' },
            { topic: 'Machine learning limitations and comparisons' },
            { topic: 'Why organizations need data scientists' },
            { topic: 'Business intelligence, data analysis, and data mining basics' },
            { topic: 'Analytics vs. data science' },
          ],
        },
        {
          moduleTitle: '2. Data Fundamentals',
          topics: [
            { topic: 'Data categorization and types' },
            { topic: 'Collection methods and data sources' },
            { topic: 'Data quality assessment and common issues' },
            { topic: 'Data architecture components' },
            { topic: 'OLTP vs. OLAP systems' },
          ],
        },
        {
          moduleTitle: '3. Big Data',
          topics: [
            { topic: 'Big Data definition and the 5 V\'s' },
            { topic: 'Big Data architecture and technologies' },
            { topic: 'Hadoop ecosystem overview' },
            { topic: 'MapReduce framework' },
            { topic: 'Distributed computing concepts' },
          ],
        },
        {
          moduleTitle: '4. Data Science Deep Dive',
          topics: [
            { topic: 'Data science lifecycle and project stages' },
            { topic: 'Data acquisition and sourcing techniques' },
            { topic: 'Data evaluation and file formats' },
            { topic: 'Data transformation and conversion' },
            { topic: 'Data anonymization methods' },
          ],
        },
        {
          moduleTitle: '5. Python Programming',
          topics: [
            { topic: 'Python fundamentals and the interpreter' },
            { topic: 'Variables, keywords, and built-in functions' },
            { topic: 'String operations and formatting' },
            { topic: 'Data structures: lists, tuples, dictionaries, and sets' },
            { topic: 'List comprehensions and generator expressions' },
          ],
        },
        {
          moduleTitle: '6. Advanced Python Concepts',
          topics: [
            { topic: 'Functions and parameters' },
            { topic: 'Global variables and scope management' },
            { topic: 'Lambda functions and sorting techniques' },
            { topic: 'Object-oriented programming and classes' },
          ],
        },
        {
          moduleTitle: '7. NumPy & Pandas',
          topics: [
            { topic: 'NumPy introduction and array operations' },
            { topic: 'Pandas DataFrames: creation and manipulation' },
            { topic: 'Grouping and sorting data' },
            { topic: 'Data visualization basics' },
            { topic: 'Slicing and dicing operations' },
          ],
        },
        {
          moduleTitle: '8. Statistics',
          topics: [
            { topic: 'Descriptive statistics and central tendency' },
            { topic: 'Measures of dispersion and data distributions' },
            { topic: 'Sampling methods and the Central Limit Theorem' },
            { topic: 'Hypothesis testing and confidence levels' },
            { topic: 'Chi-square testing, ANOVA, correlation, and regression' },
          ],
        },
        {
          moduleTitle: '9. Machine Learning: Unsupervised & Supervised',
          topics: [
            { topic: 'K-Means clustering and similarity metrics' },
            { topic: 'Association rule mining and recommendation engines' },
            { topic: 'Decision trees, random forests, and Naive Bayes' },
            { topic: 'Linear and logistic regression' },
            { topic: 'Support vector machines and kernel tricks' },
          ],
        },
        {
          moduleTitle: '10. Advanced Machine Learning Topics',
          topics: [
            { topic: 'Time series analysis with ARIMA and exponential smoothing' },
            { topic: 'Feature selection, preprocessing, and scaling' },
            { topic: 'Ensemble methods: bagging and boosting' },
            { topic: 'AdaBoost and stochastic gradient boosting' },
            { topic: 'Model selection with cross-validation and GridSearchCV' },
          ],
        },
        {
          moduleTitle: '11. Text Mining & Natural Language Processing',
          topics: [
            { topic: 'Sentiment analysis fundamentals' },
            { topic: 'Real-world text mining case studies' },
          ],
        },
        {
          moduleTitle: '12. Big Data ML with PySpark',
          topics: [
            { topic: 'Spark core architecture' },
            { topic: 'RDD (Resilient Distributed Dataset) operations' },
            { topic: 'Introduction to PySpark' },
            { topic: 'Machine learning with MLlib' },
          ],
        },
        {
          moduleTitle: '13. Deep Learning & Artificial Neural Networks',
          topics: [
            { topic: 'Biological neuron vs. artificial neuron' },
            { topic: 'Activation functions' },
            { topic: 'Gradient descent and stochastic gradient descent' },
            { topic: 'Backpropagation algorithm' },
            { topic: 'Multi-layer perceptron architecture' },
          ],
        },
        {
          moduleTitle: '14. Convolutional Neural Networks (CNNs)',
          topics: [
            { topic: 'Convolution operations and ReLU activation' },
            { topic: 'Pooling and flattening' },
            { topic: 'Full connection layers, softmax, and cross entropy' },
            { topic: 'Real-world image classification projects' },
          ],
        },
        {
          moduleTitle: '15. Recurrent Neural Networks (RNNs)',
          topics: [
            { topic: 'RNN fundamentals' },
            { topic: 'LSTM (Long Short-Term Memory) networks' },
            { topic: 'LSTM applications in Python' },
          ],
        },
        {
          moduleTitle: '16. Restricted Boltzmann Machines & Autoencoders',
          topics: [
            { topic: 'RBM theory and applications' },
            { topic: 'Introduction to autoencoders' },
            { topic: 'Building and applying autoencoder models' },
          ],
        },
        {
          moduleTitle: '17. TensorFlow Fundamentals',
          topics: [
            { topic: 'Tensors and computation graphs' },
            { topic: 'Installation and training workflow' },
            { topic: 'Data preparation and tensor operations' },
            { topic: 'Loss functions and optimization' },
          ],
        },
        {
          moduleTitle: '18. Building Neural Networks with TensorFlow',
          topics: [
            { topic: 'CPU vs. GPU vs. TPU considerations' },
            { topic: 'Neural network architecture design' },
            { topic: 'Linear regression and neuron mechanics with TensorFlow' },
            { topic: 'MNIST dataset and digit classification' },
          ],
        },
        {
          moduleTitle: '19. Deep Learning with TensorFlow',
          topics: [
            { topic: 'ConvNet architecture design' },
            { topic: 'Overfitting and regularization strategies' },
            { topic: 'Dropout, strides, and zero padding' },
            { topic: 'Debugging with TensorBoard visualization' },
          ],
        },
        {
          moduleTitle: '20. Transfer Learning with Keras & TFLearn',
          topics: [
            { topic: 'Transfer learning fundamentals' },
            { topic: 'Retraining pretrained models on custom data' },
            { topic: 'Predicting new images' },
            { topic: 'Keras vs. TFLearn' },
          ],
        },
      ],
    },
    {
      title: 'Generative AI Engineering with LLMs',
      slug: 'generative-ai-engineering-with-llms',
      category: categories['generative-ai'],
      trainer: trainers['ananya-rao'],
      level: 'advanced' as const,
      duration: '10 weeks',
      price: 45000,
      discountedPrice: 35000,
      featured: true,
      rating: 5,
      startDate: addDays(19),
      shortDescription: 'Build and ship production LLM applications using RAG, agents, and fine-tuning.',
      description: richTextFromParagraphs([
        'This hands-on program takes you from LLM fundamentals to deploying retrieval-augmented generation systems and autonomous agents in production.',
        'You will work with real APIs, vector databases, and evaluation frameworks used by AI engineering teams today.',
      ]),
      keyFeatures: [
        { feature: 'Build and deploy real LLM applications, not just prompt experiments' },
        { feature: 'Work with production vector databases and evaluation frameworks' },
        { feature: 'Capstone project: a working AI agent you can demo to employers' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'LangChain' }, { tool: 'OpenAI API' }, { tool: 'Pinecone' }, { tool: 'FastAPI' }],
      targetAudience: [
        { audience: 'Software engineers moving into AI engineering roles' },
        { audience: 'ML practitioners who want to specialize in LLM applications' },
      ],
      curriculum: [
        { moduleTitle: 'LLM Foundations', topics: [{ topic: 'Transformer architecture' }, { topic: 'Tokenization & embeddings' }] },
        { moduleTitle: 'Retrieval-Augmented Generation', topics: [{ topic: 'Vector databases' }, { topic: 'Chunking strategies' }] },
        { moduleTitle: 'AI Agents', topics: [{ topic: 'Tool calling' }, { topic: 'Multi-agent orchestration' }] },
        { moduleTitle: 'Production & Evaluation', topics: [{ topic: 'Guardrails & safety' }, { topic: 'Cost & latency optimization' }] },
      ],
    },
    {
      title: 'Machine Learning with Python',
      slug: 'machine-learning-with-python',
      category: categories['machine-learning'],
      trainer: trainers['vikram-sharma'],
      level: 'beginner' as const,
      duration: '8 weeks',
      price: 30000,
      featured: true,
      rating: 5,
      startDate: addDays(21),
      shortDescription: 'A practical introduction to supervised and unsupervised learning with Python.',
      description: richTextFromParagraphs([
        'Start from Python fundamentals and build up to training, evaluating, and tuning real machine learning models.',
        'Every module ends with a project you can add to your portfolio.',
      ]),
      keyFeatures: [
        { feature: 'No prior programming experience required' },
        { feature: 'Every module ends with a portfolio-ready project' },
        { feature: 'Small cohort sizes for direct instructor feedback' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'NumPy' }, { tool: 'pandas' }, { tool: 'scikit-learn' }],
      targetAudience: [
        { audience: 'Beginners with no prior ML or programming background' },
        { audience: 'Students preparing for a data or ML internship' },
      ],
      curriculum: [
        { moduleTitle: 'Python for ML', topics: [{ topic: 'NumPy & pandas' }, { topic: 'Data cleaning' }] },
        { moduleTitle: 'Supervised Learning', topics: [{ topic: 'Regression' }, { topic: 'Classification' }] },
        { moduleTitle: 'Unsupervised Learning', topics: [{ topic: 'Clustering' }, { topic: 'Dimensionality reduction' }] },
        { moduleTitle: 'Capstone Project', topics: [{ topic: 'End-to-end ML pipeline' }] },
      ],
    },
    {
      title: 'Data Science Bootcamp',
      slug: 'data-science-bootcamp',
      category: categories['data-science'],
      trainer: trainers['vikram-sharma'],
      level: 'intermediate' as const,
      duration: '12 weeks',
      price: 50000,
      discountedPrice: 42000,
      featured: true,
      rating: 5,
      startDate: addDays(24),
      shortDescription: 'End-to-end data science training: statistics, SQL, ML, and storytelling with data.',
      description: richTextFromParagraphs([
        'A comprehensive bootcamp covering the full data science workflow, from raw data to a stakeholder-ready presentation.',
        'Includes live projects modeled on real business problems in retail and finance.',
      ]),
      keyFeatures: [
        { feature: 'Live projects modeled on real retail and finance business problems' },
        { feature: 'Covers the full workflow: statistics, SQL, ML, and stakeholder presentation' },
        { feature: 'Resume and portfolio review with your trainer' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'SQL' }, { tool: 'pandas' }, { tool: 'Tableau' }, { tool: 'scikit-learn' }],
      targetAudience: [
        { audience: 'Analysts looking to move into a data scientist role' },
        { audience: 'Graduates targeting their first data science job' },
      ],
      curriculum: [
        { moduleTitle: 'Statistics & SQL', topics: [{ topic: 'Hypothesis testing' }, { topic: 'Advanced SQL' }] },
        { moduleTitle: 'Applied Machine Learning', topics: [{ topic: 'Feature engineering' }, { topic: 'Model selection' }] },
        { moduleTitle: 'Data Storytelling', topics: [{ topic: 'Visualization' }, { topic: 'Dashboards' }] },
      ],
    },
    {
      title: 'MLOps & Cloud AI (AWS/Azure)',
      slug: 'mlops-cloud-ai',
      category: categories['mlops-cloud-ai'],
      trainer: trainers['priya-menon'],
      level: 'advanced' as const,
      duration: '8 weeks',
      price: 40000,
      rating: 5,
      startDate: addDays(26),
      shortDescription: 'Deploy, monitor, and scale ML models in production on AWS and Azure.',
      description: richTextFromParagraphs([
        'Learn the infrastructure and tooling that separates a notebook prototype from a reliable production ML system.',
        'Covers CI/CD for ML, containerization, and monitoring for drift and performance.',
      ]),
      keyFeatures: [
        { feature: 'Hands-on labs on both AWS SageMaker and Azure ML Studio' },
        { feature: 'Build a full CI/CD pipeline for a real ML model' },
        { feature: 'Taught by a practicing MLOps architect' },
      ],
      tools: [{ tool: 'AWS SageMaker' }, { tool: 'Azure ML' }, { tool: 'Docker' }, { tool: 'Kubernetes' }, { tool: 'GitHub Actions' }],
      targetAudience: [
        { audience: 'ML engineers responsible for deploying models to production' },
        { audience: 'DevOps engineers expanding into ML infrastructure' },
      ],
      curriculum: [
        { moduleTitle: 'Cloud ML Platforms', topics: [{ topic: 'AWS SageMaker' }, { topic: 'Azure ML Studio' }] },
        { moduleTitle: 'CI/CD for ML', topics: [{ topic: 'Model versioning' }, { topic: 'Automated pipelines' }] },
        { moduleTitle: 'Monitoring', topics: [{ topic: 'Drift detection' }, { topic: 'Observability' }] },
      ],
    },
    {
      title: 'Deep Learning & Computer Vision',
      slug: 'deep-learning-computer-vision',
      category: categories['deep-learning-nlp'],
      trainer: trainers['rahul-nair'],
      level: 'advanced' as const,
      duration: '9 weeks',
      price: 42000,
      rating: 4,
      startDate: addDays(28),
      shortDescription: 'Master CNNs and modern vision architectures with hands-on PyTorch projects.',
      description: richTextFromParagraphs([
        'Go deep into convolutional networks, transfer learning, and the vision transformer models powering modern AI products.',
        'Build and deploy an image classification or detection system as your final project.',
      ]),
      keyFeatures: [
        { feature: 'Build and deploy an image classification or detection system' },
        { feature: 'Covers both classic CNNs and modern vision transformers' },
        { feature: 'Research-grade instruction from a published deep learning researcher' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'PyTorch' }, { tool: 'OpenCV' }, { tool: 'Hugging Face' }],
      targetAudience: [
        { audience: 'ML engineers specializing in computer vision' },
        { audience: 'Developers building vision-based products' },
      ],
      curriculum: [
        { moduleTitle: 'Neural Network Foundations', topics: [{ topic: 'Backpropagation' }, { topic: 'Optimization' }] },
        { moduleTitle: 'Computer Vision', topics: [{ topic: 'CNNs' }, { topic: 'Vision Transformers' }] },
        { moduleTitle: 'Final Project', topics: [{ topic: 'Model deployment' }] },
      ],
    },
    {
      title: 'Natural Language Processing with Transformers',
      slug: 'nlp-with-transformers',
      category: categories['deep-learning-nlp'],
      trainer: trainers['rahul-nair'],
      level: 'intermediate' as const,
      duration: '7 weeks',
      price: 35000,
      rating: 4,
      startDate: addDays(19),
      shortDescription: 'Build real NLP applications using transformer models and Hugging Face.',
      description: richTextFromParagraphs([
        'Understand how transformer-based language models work and apply them to classification, summarization, and search tasks.',
        'Hands-on labs use Hugging Face Transformers throughout.',
      ]),
      keyFeatures: [
        { feature: 'Hands-on labs using Hugging Face Transformers throughout' },
        { feature: 'Fine-tune a real BERT model on your own dataset' },
        { feature: 'Build a semantic search or summarization app as your project' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'Hugging Face Transformers' }, { tool: 'PyTorch' }],
      targetAudience: [
        { audience: 'ML engineers moving into NLP-focused roles' },
        { audience: 'Developers building search or text-analysis products' },
      ],
      curriculum: [
        { moduleTitle: 'NLP Fundamentals', topics: [{ topic: 'Text preprocessing' }, { topic: 'Word embeddings' }] },
        { moduleTitle: 'Transformers', topics: [{ topic: 'Attention mechanisms' }, { topic: 'Fine-tuning BERT' }] },
        { moduleTitle: 'Applications', topics: [{ topic: 'Semantic search' }, { topic: 'Summarization' }] },
      ],
    },
    {
      title: 'AI for Business Leaders',
      slug: 'ai-for-business-leaders',
      category: categories['ai-for-business'],
      trainer: trainers['priya-menon'],
      level: 'beginner' as const,
      duration: '4 weeks',
      price: 20000,
      rating: 5,
      startDate: addDays(12),
      shortDescription: 'A non-technical guide to evaluating, adopting, and governing AI in your organization.',
      description: richTextFromParagraphs([
        'Designed for managers and executives who need to make informed decisions about AI investment without writing code.',
        'Covers use-case identification, vendor evaluation, and responsible AI governance.',
      ]),
      keyFeatures: [
        { feature: 'No coding required — built for decision-makers' },
        { feature: 'Real vendor and tooling evaluation frameworks' },
        { feature: 'Covers responsible AI governance and risk management' },
      ],
      tools: [{ tool: 'No-code AI platforms' }, { tool: 'ChatGPT Enterprise' }, { tool: 'Microsoft Copilot' }],
      targetAudience: [
        { audience: 'Managers and executives evaluating AI investment' },
        { audience: 'Product leaders scoping AI features' },
      ],
      curriculum: [
        { moduleTitle: 'AI Landscape', topics: [{ topic: 'What AI can and cannot do' }] },
        { moduleTitle: 'Adoption Strategy', topics: [{ topic: 'Use-case prioritization' }, { topic: 'Build vs buy' }] },
        { moduleTitle: 'Governance', topics: [{ topic: 'Responsible AI' }, { topic: 'Risk management' }] },
      ],
    },
    {
      title: 'Prompt Engineering & AI Agents',
      slug: 'prompt-engineering-ai-agents',
      category: categories['generative-ai'],
      trainer: trainers['ananya-rao'],
      level: 'intermediate' as const,
      duration: '5 weeks',
      price: 25000,
      rating: 5,
      startDate: addDays(15),
      shortDescription: 'Master prompt design patterns and build autonomous AI agents that use tools.',
      description: richTextFromParagraphs([
        'Learn systematic prompt engineering techniques and how to design agents that can plan, use tools, and self-correct.',
        'Includes a capstone project building a working AI agent.',
      ]),
      keyFeatures: [
        { feature: 'Systematic prompt design patterns, not just trial and error' },
        { feature: 'Build a working AI agent as your capstone project' },
        { feature: 'Covers the ReAct pattern and multi-step tool use' },
      ],
      tools: [{ tool: 'OpenAI API' }, { tool: 'LangChain' }, { tool: 'Python' }],
      targetAudience: [
        { audience: 'Developers who want to build with LLMs beyond basic prompting' },
        { audience: 'Product and automation teams designing AI-assisted workflows' },
      ],
      curriculum: [
        { moduleTitle: 'Prompt Design', topics: [{ topic: 'Few-shot prompting' }, { topic: 'Chain-of-thought' }] },
        { moduleTitle: 'Agent Architectures', topics: [{ topic: 'ReAct pattern' }, { topic: 'Tool use' }] },
        { moduleTitle: 'Capstone', topics: [{ topic: 'Build an AI agent' }] },
      ],
    },
    {
      title: 'Full Stack Java',
      slug: 'full-stack-java',
      category: categories['full-stack-java'],
      trainer: trainers['kiran-kumar'],
      level: 'beginner' as const,
      duration: '6 Months',
      price: 45000,
      rating: 5,
      startDate: addDays(1),
      featured: true,
      tags: ['certification'] as CourseTags,
      bannerLabel: 'JAVA',
      bannerTag: 'Full Stack',
      shortDescription: 'Become a job-ready Java full-stack developer with Spring Boot, REST APIs, and real projects.',
      description: richTextFromParagraphs([
        'This program takes you from Core Java fundamentals through Spring Boot, database integration, and REST API development.',
        'You will build and deploy a complete full-stack application, and leave with the skills interviewers actually test for in Java developer roles.',
      ]),
      keyFeatures: [
        { feature: 'Covers Core Java through Spring Boot and microservices' },
        { feature: 'Real database integration with MySQL and Hibernate' },
        { feature: 'A full-stack capstone project for your portfolio' },
      ],
      tools: [{ tool: 'Java' }, { tool: 'Spring Boot' }, { tool: 'Hibernate' }, { tool: 'MySQL' }, { tool: 'REST APIs' }],
      targetAudience: [
        { audience: 'Beginners aiming for a Java developer role' },
        { audience: 'Developers switching stacks into Java' },
      ],
      curriculum: [
        { moduleTitle: 'Core Java', topics: [{ topic: 'OOP fundamentals' }, { topic: 'Collections & exceptions' }] },
        { moduleTitle: 'Spring & Spring Boot', topics: [{ topic: 'Dependency injection' }, { topic: 'Building REST APIs' }] },
        { moduleTitle: 'Database Integration', topics: [{ topic: 'Hibernate & JPA' }, { topic: 'MySQL' }] },
        { moduleTitle: 'Capstone Project', topics: [{ topic: 'End-to-end full-stack application' }] },
      ],
    },
    {
      title: 'Full Stack .NET Core',
      slug: 'full-stack-dotnet-core',
      category: categories['full-stack-dotnet'],
      trainer: trainers['sudhakar-reddy'],
      level: 'beginner' as const,
      duration: '6 Months',
      price: 45000,
      rating: 4.5,
      tags: ['certification'] as CourseTags,
      bannerLabel: '.NET',
      bannerTag: 'Full Stack',
      shortDescription: 'Build enterprise-grade applications with C#, .NET Core, and Azure.',
      description: richTextFromParagraphs([
        'Learn C# and .NET Core from the ground up, then move into building and deploying real web applications on Azure.',
        'Includes database design with SQL Server and the architecture patterns used in enterprise .NET codebases.',
      ]),
      keyFeatures: [
        { feature: 'C# fundamentals through .NET Core web development' },
        { feature: 'Real deployment experience on Azure' },
        { feature: 'Enterprise architecture and clean code practices' },
      ],
      tools: [{ tool: 'C#' }, { tool: '.NET Core' }, { tool: 'Azure' }, { tool: 'SQL Server' }],
      targetAudience: [
        { audience: 'Beginners aiming for a .NET developer role' },
        { audience: 'Developers moving into the Microsoft stack' },
      ],
      curriculum: [
        { moduleTitle: 'C# Fundamentals', topics: [{ topic: 'Language basics' }, { topic: 'OOP in C#' }] },
        { moduleTitle: '.NET Core Web Development', topics: [{ topic: 'ASP.NET Core MVC' }, { topic: 'Web APIs' }] },
        { moduleTitle: 'Data & Deployment', topics: [{ topic: 'SQL Server' }, { topic: 'Deploying to Azure' }] },
      ],
    },
    {
      title: 'UI Full Stack Web Development with React',
      slug: 'ui-full-stack-web-development-react',
      category: categories['full-stack-web'],
      trainer: trainers['divya-nair'],
      level: 'beginner' as const,
      duration: '5 Months',
      price: 40000,
      rating: 4.5,
      tags: ['certification'] as CourseTags,
      bannerLabel: 'WEB',
      bannerTag: 'UI Full Stack',
      shortDescription: 'Learn modern frontend development with HTML, CSS, JavaScript, and React.',
      description: richTextFromParagraphs([
        'Start from HTML, CSS, and JavaScript fundamentals and build up to production React applications.',
        'You will learn the patterns real product teams use, not just tutorial-style demos, and ship a complete UI project.',
      ]),
      keyFeatures: [
        { feature: 'From HTML/CSS/JS fundamentals to production React' },
        { feature: 'Component patterns used on real product teams' },
        { feature: 'A deployed portfolio project' },
      ],
      tools: [{ tool: 'HTML/CSS' }, { tool: 'JavaScript' }, { tool: 'React' }, { tool: 'TypeScript' }],
      targetAudience: [
        { audience: 'Beginners aiming for a frontend developer role' },
        { audience: 'Backend developers adding frontend skills' },
      ],
      curriculum: [
        { moduleTitle: 'Web Fundamentals', topics: [{ topic: 'HTML & CSS' }, { topic: 'Modern JavaScript' }] },
        { moduleTitle: 'React Development', topics: [{ topic: 'Components & hooks' }, { topic: 'State management' }] },
        { moduleTitle: 'Capstone Project', topics: [{ topic: 'Building and deploying a React app' }] },
      ],
    },
    {
      title: 'Full Stack Software Testing',
      slug: 'full-stack-software-testing',
      category: categories['software-testing'],
      trainer: trainers['arun-prakash'],
      level: 'beginner' as const,
      duration: '4 Months',
      price: 35000,
      rating: 4.5,
      tags: ['certification'] as CourseTags,
      bannerLabel: 'TESTING',
      bannerTag: 'Full Stack',
      shortDescription: 'Master manual and automated testing to launch a career in QA.',
      description: richTextFromParagraphs([
        'Learn manual testing fundamentals first, then move into automation with Selenium and API testing.',
        'You will build a full automation suite for a real application as your final project.',
      ]),
      keyFeatures: [
        { feature: 'Manual testing fundamentals before automation' },
        { feature: 'Hands-on Selenium and API testing' },
        { feature: 'A complete automation suite as your final project' },
      ],
      tools: [{ tool: 'Selenium' }, { tool: 'Playwright' }, { tool: 'Postman' }, { tool: 'JIRA' }],
      targetAudience: [
        { audience: 'Beginners aiming for a QA/test engineer role' },
        { audience: 'Manual testers adding automation skills' },
      ],
      curriculum: [
        { moduleTitle: 'Manual Testing', topics: [{ topic: 'Test case design' }, { topic: 'Bug tracking with JIRA' }] },
        { moduleTitle: 'Test Automation', topics: [{ topic: 'Selenium WebDriver' }, { topic: 'Playwright' }] },
        { moduleTitle: 'API Testing', topics: [{ topic: 'Postman' }, { topic: 'Automated API test suites' }] },
      ],
    },
    {
      title: 'Full Stack Java Placement Assistance Program',
      slug: 'full-stack-java-placement-assistance-program',
      category: categories['full-stack-java'],
      trainer: trainers['kiran-kumar'],
      level: 'beginner' as const,
      duration: '6 Months',
      price: 55000,
      rating: 4.5,
      startDate: addDays(0),
      tags: ['placement-assistance'] as CourseTags,
      bannerLabel: 'JAVA',
      bannerTag: 'Placement Assistance Program',
      shortDescription: 'Full Stack Java training bundled with dedicated placement support until you land a role.',
      description: richTextFromParagraphs([
        'The same Full Stack Java curriculum, bundled with our placement assistance program: mock interviews, resume support, and hiring partner introductions.',
        'Support continues after the course ends, until you are placed.',
      ]),
      keyFeatures: [
        { feature: 'Full Stack Java curriculum plus placement support' },
        { feature: 'Mock interviews and resume building included' },
        { feature: 'Introductions to our hiring partner network' },
      ],
      tools: [{ tool: 'Java' }, { tool: 'Spring Boot' }, { tool: 'MySQL' }],
      targetAudience: [
        { audience: 'Job seekers who want structured placement support' },
        { audience: 'Career changers targeting a Java developer role' },
      ],
      curriculum: [
        { moduleTitle: 'Core Java & Spring Boot', topics: [{ topic: 'Same curriculum as Full Stack Java' }] },
        { moduleTitle: 'Placement Preparation', topics: [{ topic: 'Mock interviews' }, { topic: 'Resume & LinkedIn support' }] },
      ],
    },
    {
      title: 'Full Stack Python and Gen AI Placement Assistance Program',
      slug: 'full-stack-python-genai-placement-assistance-program',
      category: categories['generative-ai'],
      trainer: trainers['vikram-sharma'],
      level: 'beginner' as const,
      duration: '6 Months',
      price: 55000,
      rating: 5,
      startDate: addDays(0),
      tags: ['placement-assistance'] as CourseTags,
      bannerLabel: 'PYTHON',
      bannerTag: 'Placement Assistance Program',
      shortDescription: 'Python and Generative AI training bundled with dedicated placement support.',
      description: richTextFromParagraphs([
        'Learn Python, applied machine learning, and generative AI fundamentals, bundled with our placement assistance program.',
        'Includes mock interviews, resume support, and hiring partner introductions until you are placed.',
      ]),
      keyFeatures: [
        { feature: 'Python and generative AI curriculum plus placement support' },
        { feature: 'Mock interviews and resume building included' },
        { feature: 'Introductions to our hiring partner network' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'LangChain' }, { tool: 'OpenAI API' }],
      targetAudience: [
        { audience: 'Job seekers who want structured placement support' },
        { audience: 'Career changers targeting an AI/Python developer role' },
      ],
      curriculum: [
        { moduleTitle: 'Python & Applied ML', topics: [{ topic: 'Python fundamentals' }, { topic: 'Applied machine learning' }] },
        { moduleTitle: 'Generative AI', topics: [{ topic: 'LLM fundamentals' }, { topic: 'Building with LangChain' }] },
        { moduleTitle: 'Placement Preparation', topics: [{ topic: 'Mock interviews' }, { topic: 'Resume & LinkedIn support' }] },
      ],
    },
    {
      title: 'Internship Program on Data Science',
      slug: 'internship-program-data-science',
      category: categories['data-science'],
      trainer: trainers['vikram-sharma'],
      level: 'beginner' as const,
      duration: '3 Months',
      price: 15000,
      rating: 5,
      tags: ['internship'] as CourseTags,
      shortDescription: 'A project-based internship applying data science skills to a real business problem.',
      description: richTextFromParagraphs([
        'Work on a real dataset and business problem under the mentorship of our data science trainers.',
        'You will leave with a completed project and a mentor reference for your resume.',
      ]),
      keyFeatures: [
        { feature: 'Real project, not a simulated exercise' },
        { feature: 'Direct mentorship from our data science team' },
        { feature: 'A completed project for your portfolio' },
      ],
      tools: [{ tool: 'Python' }, { tool: 'pandas' }, { tool: 'scikit-learn' }],
      targetAudience: [
        { audience: 'Students wanting real project experience' },
        { audience: 'Career changers building a portfolio' },
      ],
      curriculum: [
        { moduleTitle: 'Project Onboarding', topics: [{ topic: 'Problem scoping' }, { topic: 'Data exploration' }] },
        { moduleTitle: 'Build & Present', topics: [{ topic: 'Model building' }, { topic: 'Final presentation' }] },
      ],
    },
    {
      title: 'Internship Program on DevOps with Cloud',
      slug: 'internship-program-devops-cloud',
      category: categories['cloud-devops'],
      trainer: trainers['priya-menon'],
      level: 'beginner' as const,
      duration: '3 Months',
      price: 15000,
      rating: 4.5,
      tags: ['internship'] as CourseTags,
      shortDescription: 'A hands-on internship setting up CI/CD pipelines and cloud infrastructure.',
      description: richTextFromParagraphs([
        'Work alongside our MLOps team setting up real CI/CD pipelines and cloud infrastructure for a live project.',
        'You will leave with hands-on cloud experience and a mentor reference for your resume.',
      ]),
      keyFeatures: [
        { feature: 'Real infrastructure work, not a simulated exercise' },
        { feature: 'Direct mentorship from our cloud/DevOps team' },
        { feature: 'Hands-on experience with CI/CD and containers' },
      ],
      tools: [{ tool: 'Docker' }, { tool: 'Kubernetes' }, { tool: 'AWS' }],
      targetAudience: [
        { audience: 'Students wanting real infrastructure experience' },
        { audience: 'Developers exploring a DevOps career path' },
      ],
      curriculum: [
        { moduleTitle: 'Cloud & Container Basics', topics: [{ topic: 'Docker fundamentals' }, { topic: 'Cloud infrastructure basics' }] },
        { moduleTitle: 'Build & Present', topics: [{ topic: 'CI/CD pipeline setup' }, { topic: 'Final presentation' }] },
      ],
    },
  ]

  const courses: Record<string, number> = {}
  for (const def of courseDefs) {
    const existing = await payload.find({ collection: 'courses', where: { slug: { equals: def.slug } }, limit: 1 })
    const doc = existing.totalDocs > 0
      ? await payload.update({ collection: 'courses', id: existing.docs[0].id, data: def })
      : await payload.create({ collection: 'courses', data: def })
    courses[def.slug] = doc.id
  }

  // --- Testimonials ---
  const testimonialDefs = [
    {
      studentName: 'Sneha Kulkarni',
      course: courses['generative-ai-engineering-with-llms'],
      quote: 'The RAG and agents modules were exactly what I needed to transition into an AI engineering role. Ananya’s feedback on my capstone project was incredibly detailed.',
      rating: 5,
      placedAt: 'Placed as AI Engineer at a fintech startup',
    },
    {
      studentName: 'Arjun Mehta',
      course: courses['machine-learning-with-python'],
      quote: 'I had zero ML background before this course. The pacing and the projects made everything click.',
      rating: 5,
      placedAt: 'Placed as Junior Data Analyst',
    },
    {
      studentName: 'Divya Patel',
      course: courses['data-science-bootcamp'],
      quote: 'Twelve weeks that completely changed my career trajectory. The capstone project became the centerpiece of my portfolio.',
      rating: 5,
      placedAt: 'Placed as Data Scientist at an e-commerce company',
    },
    {
      studentName: 'Karthik Iyer',
      course: courses['mlops-cloud-ai'],
      quote: 'Priya’s real-world experience with production ML systems is unmatched. This is the course that actually teaches you how things work in industry.',
      rating: 5,
      placedAt: 'Promoted to MLOps Engineer',
    },
    {
      studentName: 'Meera Krishnan',
      course: courses['nlp-with-transformers'],
      quote: 'Rahul breaks down transformer architectures in a way that finally made sense to me after struggling with other resources.',
      rating: 4,
      placedAt: 'Placed as NLP Engineer',
    },
  ]
  for (const def of testimonialDefs) {
    const existing = await payload.find({ collection: 'testimonials', where: { studentName: { equals: def.studentName } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'testimonials', data: def })
    }
  }

  // --- Blog posts ---
  const blogDefs = [
    {
      title: '5 Skills Every Aspiring ML Engineer Needs in 2026',
      slug: '5-skills-every-aspiring-ml-engineer-needs-in-2026',
      author: trainers['vikram-sharma'],
      excerpt: 'The field has moved fast. Here is what actually matters for landing your first ML role this year.',
      content: richTextFromParagraphs([
        'Machine learning hiring has shifted significantly over the past two years. Strong fundamentals still matter, but so does the ability to work with modern tooling.',
        '1. Solid Python and SQL. 2. Understanding of the ML lifecycle, not just model training. 3. Comfort with at least one cloud ML platform. 4. Ability to communicate results to non-technical stakeholders. 5. Familiarity with LLM-based tools, even outside of NLP-specific roles.',
      ]),
      tags: [{ tag: 'Career' }, { tag: 'Machine Learning' }],
    },
    {
      title: 'How Generative AI Is Reshaping Software Careers',
      slug: 'how-generative-ai-is-reshaping-software-careers',
      author: trainers['ananya-rao'],
      excerpt: 'Generative AI is not replacing engineers — it is changing what the job looks like. Here is how to stay ahead.',
      content: richTextFromParagraphs([
        'Every few years a new technology forces a rethink of what it means to be a software professional. Generative AI is the current one.',
        'Engineers who learn to build with LLMs — not just use them — are seeing the biggest career upside right now, whether that means RAG systems, agentic workflows, or fine-tuning for domain-specific tasks.',
      ]),
      tags: [{ tag: 'Generative AI' }, { tag: 'Careers' }],
    },
    {
      title: 'MLOps 101: Taking Models from Notebook to Production',
      slug: 'mlops-101-notebook-to-production',
      author: trainers['priya-menon'],
      excerpt: 'A model that only works in a Jupyter notebook is not done. Here is what production-readiness actually requires.',
      content: richTextFromParagraphs([
        'The gap between a working notebook and a production ML system is often underestimated. Versioning, monitoring, and reproducibility are not optional extras.',
        'Start with reproducible environments, add automated testing for data and model quality, and build monitoring for drift from day one — not after something breaks.',
      ]),
      tags: [{ tag: 'MLOps' }, { tag: 'Cloud AI' }],
    },
    {
      title: 'Cracking the Data Science Interview: Common Questions & How to Answer Them',
      slug: 'cracking-the-data-science-interview',
      author: trainers['vikram-sharma'],
      excerpt: 'A practical breakdown of what interviewers are actually testing for, beyond the textbook definitions.',
      content: richTextFromParagraphs([
        'Data science interviews test three things: statistical intuition, practical coding ability, and business judgment. Most candidates over-prepare for one and neglect the others.',
        'Practice explaining your reasoning out loud, not just arriving at the right answer — interviewers are evaluating how you think.',
      ]),
      tags: [{ tag: 'Data Science' }, { tag: 'Interview Prep' }],
    },
  ]
  for (const def of blogDefs) {
    const existing = await payload.find({ collection: 'blog-posts', where: { slug: { equals: def.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'blog-posts', data: { ...def, publishedDate: new Date().toISOString() } })
    }
  }

  // --- Demo slots ---
  const existingSlots = await payload.count({ collection: 'demo-slots' })
  if (existingSlots.totalDocs === 0) {
    const now = new Date()
    const slotDefs: { daysFromNow: number; course?: number }[] = [
      { daysFromNow: 2 },
      { daysFromNow: 4, course: courses['generative-ai-engineering-with-llms'] },
      { daysFromNow: 6 },
      { daysFromNow: 9, course: courses['data-science-bootcamp'] },
      { daysFromNow: 11 },
      { daysFromNow: 13, course: courses['machine-learning-with-python'] },
    ]
    for (const s of slotDefs) {
      const startsAt = new Date(now)
      startsAt.setDate(startsAt.getDate() + s.daysFromNow)
      startsAt.setHours(18, 0, 0, 0)
      const endsAt = new Date(startsAt)
      endsAt.setHours(19, 0, 0, 0)

      await payload.create({
        collection: 'demo-slots',
        data: {
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
          course: s.course,
          capacity: 20,
          isActive: true,
        },
      })
    }
  }

  // --- Batches ---
  const existingBatches = await payload.count({ collection: 'batches' })
  if (existingBatches.totalDocs === 0) {
    const now = new Date()
    const batchDefs: {
      course: number
      facultyName: string
      mode: 'online' | 'classroom' | 'weekend' | 'workshop' | 'internship'
      daysFromNow: number
      hour: number
      meetingLink?: string
    }[] = [
      { course: courses['artificial-intelligence-training'], facultyName: 'Vikram Sharma', mode: 'online', daysFromNow: 1, hour: 19, meetingLink: 'https://meet.tinitiateai.com/ai-training' },
      { course: courses['generative-ai-engineering-with-llms'], facultyName: 'Ananya Rao', mode: 'online', daysFromNow: 3, hour: 18 },
      { course: courses['machine-learning-with-python'], facultyName: 'Real-Time Expert', mode: 'weekend', daysFromNow: 4, hour: 10 },
      { course: courses['data-science-bootcamp'], facultyName: 'Vikram Sharma', mode: 'classroom', daysFromNow: 5, hour: 9 },
      { course: courses['mlops-cloud-ai'], facultyName: 'Priya Menon', mode: 'online', daysFromNow: 6, hour: 19, meetingLink: 'https://meet.tinitiateai.com/mlops-cloud-ai' },
      { course: courses['nlp-with-transformers'], facultyName: 'Rahul Nair', mode: 'workshop', daysFromNow: 7, hour: 17 },
      { course: courses['deep-learning-computer-vision'], facultyName: 'Rahul Nair', mode: 'online', daysFromNow: 8, hour: 18 },
      { course: courses['prompt-engineering-ai-agents'], facultyName: 'Ananya Rao', mode: 'internship', daysFromNow: 10, hour: 11 },
      { course: courses['ai-for-business-leaders'], facultyName: 'Priya Menon', mode: 'weekend', daysFromNow: 12, hour: 10 },
    ]
    for (const b of batchDefs) {
      const startsAt = new Date(now)
      startsAt.setDate(startsAt.getDate() + b.daysFromNow)
      startsAt.setHours(b.hour, 0, 0, 0)

      await payload.create({
        collection: 'batches',
        data: {
          course: b.course,
          facultyName: b.facultyName,
          mode: b.mode,
          startsAt: startsAt.toISOString(),
          meetingLink: b.meetingLink,
          isActive: true,
        },
      })
    }
  }

  payload.logger.info('Seeding complete.')
}
