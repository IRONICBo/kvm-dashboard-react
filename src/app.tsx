import { RunTimeLayoutConfig } from '@umijs/max';
import { Button } from 'antd';
import { history } from 'umi';

export async function getInitialState() {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  return {
    userLoginCookie: cookies['satoken'] || null,
  };
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  const handleLogout = () => {
    console.log("Logging out user...");
    document.cookie = "satoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // 删除cookie
    history.push('/login'); // 跳转到登录页面
  };

  const handleLogin = () => {
    history.push('/login'); // 跳转到登录页面
  };

  return {
    // 常用属性
    title: '申威测试脚本集成管理',
    // logo: '/logo.png',
    contentStyle: {
    },
    // 默认布局调整
    rightContentRender: () => {
      return (
        <>
          {initialState.initialState.userLoginCookie ? (
            <Button type="dashed" size="large" onClick={handleLogout} style={{width: "100%"}}>
              退出登录
            </Button>
          ) : (
            <Button type="dashed" size="large" onClick={handleLogin} style={{width: "100%"}}>
              登录
            </Button>
          )}
        </>
      );
    },
    footerRender: () => {
      console.log(initialState.initialState.userLoginCookie);
    },
    menuHeaderRender: undefined,
    // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
    logout: () => {
      console.log(initialState.userName);
    }
  };
};