import { RunTimeLayoutConfig } from '@umijs/max';

export const layout: RunTimeLayoutConfig = (initialState) => {
  return {
    // 常用属性
    title: '申威测试脚本集成管理',
    // logo: '/logo.png',
    contentStyle: {
    },
    // 默认布局调整
    // rightContentRender: () => <RightContent />,
    footerRender: () => null,
    menuHeaderRender: undefined,
    // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
    logout: () => {
    }
  };
};