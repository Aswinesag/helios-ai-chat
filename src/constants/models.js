// Model Configuration

export const MODELS = [
    { id: 'mistralai/devstral-2512:free', label: 'Devstral 2', shortlabel: 'Devstral 2' },
    { id: 'deepseek/deepseek-r1t2-chimera:free', label: 'DeepSeek v3.1 Nex N1', shortlabel: 'vDeepSeek 3.1' },
    { id: 'tngtech/deepseek-r1t-chimera:free', label: 'Amazon Nova 2 Lite', shortlabel: 'Nova 2 Lite' },
    { id: 'z-ai/glm-4.5-air:free', label: 'Arcee Trinity Mini', shortlabel: 'Trinity Mini' },
    { id: 'qwen/qwen3-coder:free', label: 'TNG R1T Chimera', shortlabel: 'TNG Chimera' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', label: 'Olmo 3.32B Think', shortlabel: 'Olmo 3.32B' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Kat Coder Pro V1', shortlabel: 'Kat Coder Pro' },
    { id: 'nvidia/nemotron-nano-12b-v2-vl:free', label: 'Nemotron Nano 12B VL', shortlabel: 'Nemotron Nano 12B' },
    { id: 'google/gemma-3-27b:free', label: 'Tongyi Deepresearch 30B', shortlabel: 'Deepresearch 30B' },
    { id: 'openai/gpt-oss-120b:free', label: 'GPT-4o Mini Vision', shortlabel: 'GPT-4o Mini' },
    { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini Flash 1.5', shortlabel: 'Gemini Flash' }
]

// Set of models that support vision/image analysis
export const VISION_MODELS_IDS = new Set([
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'google/gemini-2.0-flash-exp:free'
])

// Model ID for Nova that support file attachment
export const NOVA_FILE_MODEL_ID = 'tngtech/deepseek-r1t-chimera:free'