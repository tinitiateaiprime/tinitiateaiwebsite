import { Container } from '@/components/ui/Container'

export const metadata = { title: 'Interview Questions — TinitiateAI' }

const categories = [
  {
    name: 'Machine Learning',
    questions: [
      {
        q: 'What is the difference between bagging and boosting?',
        a: 'Bagging trains multiple models in parallel on random subsets of the data and averages their predictions to reduce variance (e.g. Random Forest). Boosting trains models sequentially, where each new model focuses on correcting the errors of the previous ones, reducing bias (e.g. AdaBoost, Gradient Boosting).',
      },
      {
        q: 'How do you handle overfitting in a model?',
        a: 'Common approaches include gathering more training data, simplifying the model, adding regularization (L1/L2), using dropout in neural networks, cross-validation, and early stopping during training.',
      },
      {
        q: 'Explain the bias-variance tradeoff.',
        a: 'Bias is error from overly simplistic assumptions (underfitting), while variance is error from sensitivity to small fluctuations in training data (overfitting). Reducing one typically increases the other, so model selection is about finding the right balance for your data.',
      },
      {
        q: 'When would you use precision vs. recall as your primary metric?',
        a: 'Use precision when false positives are costly (e.g. spam detection), and recall when false negatives are costly (e.g. disease screening). F1 score is useful when you need a balance of both.',
      },
    ],
  },
  {
    name: 'Data Science',
    questions: [
      {
        q: 'How do you deal with missing data in a dataset?',
        a: 'Options include removing rows/columns with excessive missing values, imputing with mean/median/mode, using model-based imputation, or treating "missing" itself as an informative category, depending on why the data is missing.',
      },
      {
        q: 'What is the Central Limit Theorem and why does it matter?',
        a: 'It states that the sampling distribution of the mean approaches a normal distribution as sample size increases, regardless of the population’s original distribution. This underpins most hypothesis testing and confidence interval methods used in analysis.',
      },
      {
        q: 'Walk through how you would approach a new data science project.',
        a: 'Start by clarifying the business question, then explore and clean the data, do exploratory analysis to form hypotheses, engineer features, build and validate a baseline model, iterate, and finally communicate results with visualizations tailored to the audience.',
      },
      {
        q: 'What is the difference between correlation and causation?',
        a: 'Correlation means two variables move together, but that doesn’t mean one causes the other — there could be a confounding variable or pure coincidence. Establishing causation typically requires controlled experiments (e.g. A/B testing) or careful causal inference methods.',
      },
    ],
  },
  {
    name: 'Generative AI',
    questions: [
      {
        q: 'What is Retrieval-Augmented Generation (RAG) and why use it?',
        a: 'RAG retrieves relevant documents from an external knowledge base and feeds them into an LLM’s context before generation. It reduces hallucination and lets the model answer questions about information it wasn’t trained on, without retraining the model itself.',
      },
      {
        q: 'How does attention work in a transformer model?',
        a: 'Attention lets the model weigh how relevant every other token in the input is when processing a given token, allowing it to capture long-range dependencies. Self-attention computes these weights using learned query, key, and value projections.',
      },
      {
        q: 'What is prompt engineering and what techniques improve output quality?',
        a: 'It’s the practice of structuring inputs to get better outputs from an LLM. Techniques include few-shot examples, chain-of-thought prompting, clear role/context framing, and specifying the desired output format explicitly.',
      },
      {
        q: 'What are the risks of deploying an LLM-based application in production?',
        a: 'Hallucination, prompt injection, inconsistent outputs, latency/cost at scale, and data privacy when sending user data to third-party APIs. Production systems typically add guardrails, evaluation pipelines, and human review for high-stakes outputs.',
      },
    ],
  },
  {
    name: 'MLOps & Cloud AI',
    questions: [
      {
        q: 'What is model drift and how do you detect it?',
        a: 'Model drift is when a model’s performance degrades over time because the real-world data distribution has shifted from what it was trained on. It’s detected by monitoring input data distributions and prediction accuracy against ground truth over time.',
      },
      {
        q: 'What does a CI/CD pipeline for machine learning typically include?',
        a: 'Automated data validation, model training and evaluation against a benchmark, model versioning, containerization, staged deployment (e.g. canary or shadow deployment), and automated rollback if monitoring flags a regression.',
      },
      {
        q: 'Why containerize a machine learning model for deployment?',
        a: 'Containers package the model with its exact dependencies and runtime environment, making deployments reproducible across development, staging, and production, and easier to scale with orchestration tools like Kubernetes.',
      },
    ],
  },
]

export default function InterviewQuestionsPage() {
  return (
    <Container className="py-16">
      <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Training</span>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Interview Questions</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        A working set of questions our trainers use to prep students for real interviews, organized by topic.
      </p>

      <div className="mt-10 space-y-10">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-xl font-bold text-slate-900">{cat.name}</h2>
            <div className="mt-4 space-y-3">
              {cat.questions.map((item, i) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
                  open={i === 0}
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
