export interface CostData {
  timestamp: string;
  aws: number;
  gcp: number;
  azure: number;
  utilization: number;
}

export interface AWSServiceData {
  timestamp: string;
  ec2: number;
  s3: number;
  lambda: number;
  rds: number;
  utilization: number;
}

export interface APIUsage {
  team: string;
  endpoint: string;
  calls: number;
  latency: number;
  cost: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}