// Văn bản lá số mẫu (định dạng người dùng gửi) để thử nhanh
import SAMPLE from './sampleText';
import { parseChartText } from './parseText';
export const SAMPLE_TEXT = SAMPLE;
export const SAMPLE_INPUT = parseChartText(SAMPLE).bazi!;
