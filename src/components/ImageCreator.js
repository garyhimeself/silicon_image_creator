import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Collapse,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Divider,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import ReplayIcon from '@mui/icons-material/Replay';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { generateImage } from '../services/api';

// 创建科技科幻风格的暗黑主题
const scifiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f0ff', // 霓虹青色
    },
    secondary: {
      main: '#bf00ff', // 霓虹紫色
    },
    background: {
      default: '#0a0a14', // 深蓝黑色
      paper: '#121225', // 稍亮的深蓝黑色
    },
    text: {
      primary: '#ffffff', // 白色文字
      secondary: '#a0a0c0', // 浅紫灰色
    },
    error: {
      main: '#ff366e', // 霓虹红色
    },
    success: {
      main: '#26ffbb', // 霓虹绿色
    }
  },
  typography: {
    fontFamily: '"Exo 2", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
      letterSpacing: '1px',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(145deg, #0a0a14 0%, #121230 100%)',
          backgroundAttachment: 'fixed',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0, 240, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
          textTransform: 'none',
          padding: '10px 20px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'all 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #00c2ff 0%, #00f0ff 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #00d2ff 0%, #00ffff 100%)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.8)',
          },
        },
        outlined: {
          borderColor: '#00f0ff',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.6)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 240, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 240, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00f0ff',
              boxShadow: '0 0 8px rgba(0, 240, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#00f0ff',
          '& .MuiSlider-rail': {
            background: 'rgba(0, 240, 255, 0.2)',
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #00c2ff 0%, #00f0ff 100%)',
          },
          '& .MuiSlider-thumb': {
            boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
        },
        standardError: {
          background: 'rgba(255, 54, 110, 0.1)',
          border: '1px solid rgba(255, 54, 110, 0.3)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '8px 0 16px 0',
        },
      },
    },
  },
});

function ImageCreator() {
  // 基本状态
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 高级参数状态
  const [imageSize, setImageSize] = useState('1024x1024');
  const [inferenceSteps, setInferenceSteps] = useState(15);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 4999999999));
  const [useSeed, setUseSeed] = useState(false);
  
  // 响应式布局
  const isMobile = useMediaQuery(scifiTheme.breakpoints.down('sm'));
  
  // 可用的图片尺寸选项
  const imageSizeOptions = [
    { value: '1024x1024', label: '1024×1024 - 方形' },
    { value: '960x1280', label: '960×1280 - 竖向' },
    { value: '768x1024', label: '768×1024 - 竖向' },
    { value: '720x1440', label: '720×1440 - 长竖向' },
    { value: '720x1280', label: '720×1280 - 竖向' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setErrorDetails('');
    setShowDetails(false);
    
    try {
      // 构建API请求参数
      const params = {
        prompt,
        negativePrompt: negativePrompt || undefined,
        imageSize,
        inferenceSteps,
        guidanceScale,
        seed: useSeed ? seed : undefined
      };
      
      const imageData = await generateImage(params);
      console.log('收到图片数据类型:', typeof imageData);
      setImage(imageData);
    } catch (err) {
      console.error('Error generating image:', err);
      
      // 设置更具体的错误信息
      if (err.response) {
        // 服务器响应了错误状态码
        if (err.response.status === 401 || err.response.status === 403) {
          setError('API密钥无效或缺失，请检查配置');
        } else if (err.response.status === 429) {
          setError('API请求过于频繁，请稍后重试');
        } else if (err.response.status >= 500) {
          setError('服务器错误，请稍后重试');
        } else {
          setError(`API请求失败: ${err.response.status} ${err.response.statusText || ''}`);
        }
        
        // 保存详细错误信息以便用户查看
        if (err.response.data) {
          try {
            setErrorDetails(JSON.stringify(err.response.data, null, 2));
          } catch (e) {
            setErrorDetails(String(err.response.data));
          }
        }
      } else if (err.request) {
        // 请求已发送但没有收到响应
        setError('没有收到API响应，请检查网络连接');
      } else {
        // 请求配置出错
        setError(err.message || '生成图片时出错，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const regenerateWithSameSeed = () => {
    if (!useSeed) {
      setUseSeed(true);
    }
    handleSubmit(new Event('submit'));
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 4999999999));
  };

  // 下载图片的处理逻辑
  const handleDownload = () => {
    if (!image) return;
    
    try {
      // 确定文件名
      const fileName = `silicon-image-${Date.now()}.png`;
      
      // 处理不同类型的图片数据
      if (image.startsWith('data:')) {
        // 处理Base64数据URL
        const link = document.createElement('a');
        link.href = image;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (image.startsWith('http')) {
        // 处理远程URL，使用fetch下载
        fetch(image)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
          })
          .catch(err => {
            console.error('下载图片失败:', err);
            alert('下载图片失败，请重试');
          });
      } else {
        // 如果是纯base64字符串（没有data:前缀）
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${image}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('下载过程中出错:', err);
      alert('下载图片时出错，请重试');
    }
  };

  return (
    <ThemeProvider theme={scifiTheme}>
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        px: 2, 
        py: 4,
        minHeight: '100vh',
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 5, 
            background: 'linear-gradient(90deg, #00f0ff, #00c2ff, #bf00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 240, 255, 0.6)'
          }}
        >
          SILICON IMAGE CREATOR
        </Typography>
        
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'rgba(18, 18, 37, 0.7)', 
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
            }
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
              }}
            >
              <AutoFixHighIcon sx={{ mr: 1, color: '#00f0ff' }} />
              创建你想象中的画面
            </Typography>
            
            <TextField
              fullWidth
              label="输入提示词"
              variant="outlined"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              placeholder="例如：一只在星球表面奔跑的机械狼，未来科技风格"
              multiline
              rows={2}
            />
            
            <Accordion 
              expanded={showAdvanced} 
              onChange={() => setShowAdvanced(!showAdvanced)}
              elevation={0}
              sx={{ 
                mb: 3,
                backgroundColor: 'transparent',
                border: '1px solid rgba(0, 240, 255, 0.1)',
                borderRadius: '4px',
                '&:hover': {
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#00f0ff' }} />}
                aria-controls="advanced-settings-content"
                id="advanced-settings-header"
                sx={{ px: 2 }}
              >
                <Typography color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                  高级设置
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="负面提示词（排除不需要的元素）"
                      variant="outlined"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      disabled={loading}
                      placeholder="例如：模糊, 变形, 低质量"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="image-size-label">图片尺寸</InputLabel>
                      <Select
                        labelId="image-size-label"
                        value={imageSize}
                        label="图片尺寸"
                        onChange={(e) => setImageSize(e.target.value)}
                        disabled={loading}
                      >
                        {imageSizeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={useSeed}
                            onChange={(e) => setUseSeed(e.target.checked)}
                            disabled={loading}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#00f0ff',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'rgba(0, 240, 255, 0.5)',
                              },
                            }}
                          />
                        }
                        label="使用固定种子"
                      />
                      {useSeed && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: isMobile ? 1 : 0, width: isMobile ? '100%' : 'auto' }}>
                          <TextField
                            label="种子值"
                            type="number"
                            value={seed}
                            onChange={(e) => setSeed(Number(e.target.value))}
                            disabled={loading}
                            size="small"
                            sx={{ mx: 1, width: '100%' }}
                          />
                          <IconButton 
                            onClick={handleRandomSeed} 
                            disabled={loading}
                            size="small"
                            sx={{ color: '#00f0ff' }}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom sx={{ color: '#a0a0c0' }}>
                      推理步数: <span style={{ color: '#00f0ff' }}>{inferenceSteps}</span>
                    </Typography>
                    <Slider
                      value={inferenceSteps}
                      onChange={(e, newValue) => setInferenceSteps(newValue)}
                      min={5}
                      max={30}
                      step={1}
                      marks={[
                        { value: 5, label: '5' },
                        { value: 15, label: '15' },
                        { value: 30, label: '30' }
                      ]}
                      disabled={loading}
                    />
                    <Typography variant="body2" color="text.secondary">
                      较低值生成速度快，较高值生成质量好
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom sx={{ color: '#a0a0c0' }}>
                      创造性: <span style={{ color: '#00f0ff' }}>{guidanceScale.toFixed(1)}</span>
                    </Typography>
                    <Slider
                      value={guidanceScale}
                      onChange={(e, newValue) => setGuidanceScale(newValue)}
                      min={1}
                      max={15}
                      step={0.5}
                      marks={[
                        { value: 1, label: '创意' },
                        { value: 7.5, label: '平衡' },
                        { value: 15, label: '精确' }
                      ]}
                      disabled={loading}
                    />
                    <Typography variant="body2" color="text.secondary">
                      较低值更有创意，较高值更符合提示词
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth={isMobile}
                disabled={loading || !prompt.trim()}
                sx={{ 
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, transparent, rgba(0, 240, 255, 0.2), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.8s',
                  },
                  '&:hover::after': {
                    transform: 'translateX(100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '生成图片'}
              </Button>
              
              {image && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={regenerateWithSameSeed}
                  disabled={loading}
                  sx={{ 
                    minWidth: 120,
                    flexGrow: isMobile ? 1 : 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  重新生成
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              backgroundColor: 'rgba(255, 54, 110, 0.1)',
              border: '1px solid rgba(255, 54, 110, 0.3)',
            }}
            action={
              errorDetails ? (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? '隐藏详情' : '查看详情'}
                </Button>
              ) : null
            }
          >
            <AlertTitle>错误</AlertTitle>
            {error}
            <Collapse in={showDetails} sx={{ mt: 1 }}>
              <Box 
                component="pre" 
                sx={{ 
                  mt: 1, 
                  p: 1, 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: '200px',
                  border: '1px solid rgba(255, 54, 110, 0.2)',
                }}
              >
                {errorDetails}
              </Box>
            </Collapse>
          </Alert>
        )}

        {image && (
          <Paper 
            elevation={1} 
            sx={{ 
              overflow: 'hidden',
              background: 'rgba(18, 18, 37, 0.7)',
              border: '1px solid rgba(0, 240, 255, 0.15)',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  boxShadow: 'inset 0 0 30px rgba(0, 240, 255, 0.1)',
                },
              }}
            >
              <img
                src={image.startsWith('data:') || image.startsWith('http') ? image : `data:image/png;base64,${image}`}
                alt="生成的图片"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={(e) => {
                  console.error('图片加载错误:', e);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x800?text=图片加载失败';
                }}
              />
            </Box>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                sx={{ 
                  minWidth: 200,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
                startIcon={<CloudDownloadIcon />}
              >
                下载图片
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default ImageCreator; 