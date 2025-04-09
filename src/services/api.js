import axios from 'axios';

// 使用提供的API密钥
const API_KEY = 'sk-dyvetojmacrgzatruykwzpgonxvqjyyxiptdhvxdemlmtjww';
// 根据硅基流动API文档的正确URL
const API_URL = 'https://api.siliconflow.cn/v1/images/generations';

// 重试配置
const MAX_RETRIES = 2;
const RETRY_DELAY = 3000; // 3秒延迟

// 辅助函数：延迟执行
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成图片
 * @param {Object} params - 图片生成参数
 * @param {string} params.prompt - 正面提示词
 * @param {string} [params.negativePrompt] - 负面提示词
 * @param {string} [params.imageSize='1024x1024'] - 图片尺寸
 * @param {number} [params.inferenceSteps=15] - 推理步数
 * @param {number} [params.guidanceScale=7.5] - 引导系数
 * @param {number} [params.seed] - 随机种子
 * @returns {Promise<string>} - 图片URL或Base64数据
 */
export const generateImage = async ({
  prompt,
  negativePrompt = '',
  imageSize = '1024x1024',
  inferenceSteps = 15,
  guidanceScale = 7.5,
  seed
}) => {
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      console.log(`尝试生成图片 (尝试 ${retries + 1}/${MAX_RETRIES + 1})...`);
      
      // 根据API文档构建请求参数
      const requestData = {
        model: "Kwai-Kolors/Kolors", // 使用文档中的模型
        prompt: prompt,
        negative_prompt: negativePrompt, // 负面提示词
        image_size: imageSize, // 图片尺寸
        batch_size: 1, // 生成一张图片
        num_inference_steps: inferenceSteps, // 推理步数
        guidance_scale: guidanceScale, // 指导比例
      };
      
      // 只有当用户指定了种子值时才添加到请求中
      if (seed !== undefined) {
        requestData.seed = seed;
      }
      
      console.log('API请求参数:', requestData);

      const response = await axios.post(
        API_URL,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          timeout: 180000, // 增加超时时间到3分钟
          responseType: 'json' // 确保响应以JSON格式返回
        }
      );

      console.log('API响应:', response.data);
      
      // 根据官方文档处理响应格式
      if (response.data && response.data.images && response.data.images.length > 0) {
        if (response.data.images[0].url) {
          // 正确的响应格式
          console.log('成功获取图片URL');
          return response.data.images[0].url;
        } else if (typeof response.data.images[0] === 'string') {
          // 有些情况可能直接返回URL字符串
          console.log('成功获取图片数据');
          return response.data.images[0];
        }
      }
      
      // 如果响应格式不符合预期，记录错误但尝试解析
      console.warn('响应格式与预期不符:', response.data);
      
      // 尝试其他可能的格式
      if (response.data && response.data.url) {
        return response.data.url;
      } else if (response.data && typeof response.data === 'string') {
        // 如果响应是字符串形式
        if (response.data.startsWith('http')) {
          return response.data;
        } else if (response.data.startsWith('data:image')) {
          return response.data;
        }
      }
      
      // 如果所有尝试都失败
      throw new Error('未能在响应中找到图片URL或数据');
      
    } catch (error) {
      console.error(`API调用出错 (尝试 ${retries + 1}/${MAX_RETRIES + 1}):`, {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request sent but no response' : 'No request'
      });
      
      // 检查是否是超时错误或服务器错误
      const isTimeout = error.code === 'ECONNABORTED' || 
                       (error.response && error.response.data && 
                        (error.response.data.message?.includes('timeout') || 
                         error.response.data.message?.includes('deadline exceeded')));
                         
      const isServerError = error.response && 
                           (error.response.status >= 500 || 
                            (error.response.data && error.response.data.code === 60000));
      
      // 如果是超时或服务器错误且还有重试次数，则重试
      if ((isTimeout || isServerError) && retries < MAX_RETRIES) {
        retries++;
        console.log(`等待 ${RETRY_DELAY/1000} 秒后重试...`);
        await delay(RETRY_DELAY);
        continue;
      }
      
      // 所有重试都失败或不是可重试的错误
      throw error;
    }
  }
  
  // 这行代码不应该被执行，因为上面的循环会在成功时返回或在失败时抛出错误
  throw new Error('图片生成请求失败，已达到最大重试次数');
};

// 辅助函数：检查字符串是否为base64编码
function isBase64(str) {
  try {
    // 尝试一个简单的base64检测
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
} 