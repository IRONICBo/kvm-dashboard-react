import { RunTimeLayoutConfig } from '@umijs/max';

export const layout: RunTimeLayoutConfig = (initialState) => {
  return {
    // 常用属性
    title: '虚拟机运维平台',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    contentStyle: {
    },
    // 默认布局调整
    // rightContentRender: () => <RightContent />,
    // footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
  };
};