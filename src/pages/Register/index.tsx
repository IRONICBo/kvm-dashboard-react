import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
  apiUserRegister,
  apiCreateAuthGroup,
  apiGetAuthGroup,
  apiDeleteAuthGroup,
  apiGetAuthInfo,
  apiCreateAuthInfo,
  apiDeleteAuthInfo,
} from '@/api/User';

  type LoginType = 'account';

  export default () => {
    // const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('account');

    const iconStyles: CSSProperties = {
      marginInlineStart: '16px',
    //   color: setAlpha(token.colorTextBase, 0.2),
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
    };

    return (
      <ProConfigProvider hashed={false}>
        <div
            style={{
                backgroundColor: '#def3ff',
                padding: 100,
                height: '100vh',
            }}
        >
          <LoginForm
            title="申威测试脚本集成管理系统"
            subTitle="欢迎使用申威测试脚本集成管理系统！"
            initialValues={{ autoLogin: true }}
            style={{
                maxWidth: 520,
                margin: 'auto',
            }}
            onFinish={async (values) => {
              message.success('注册中');
              let registerValues = {
                userEmail: values.useremail,
                userUsername: values.username,
                userPhone: values.userphone,
                userPassword: values.password,
              };
              apiUserRegister(registerValues).then((res) => {
                if (res.code === 200) {
                  message.success('注册成功！');
                } else {
                  message.error('注册失败！');
                }
              });
            }}
          >
            <Tabs
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            >
              <Tabs.TabPane key={'account'} tab={'账号密码注册'} />
            </Tabs>
            {loginType === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'用户名: admin or user'}
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText
                  name="userphone"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'手机号: 1xxxxxxxxxx'}
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号!',
                    },
                  ]}
                />
                <ProFormText
                  name="useremail"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'邮箱: xxx@xxx.com'}
                  rules={[
                    {
                      required: true,
                      message: '请输入邮箱!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                    strengthText:
                      'Password should contain numbers, letters and special characters, at least 8 characters long.',
                    statusRender: (value) => {
                      const getStatus = () => {
                        if (value && value.length > 12) {
                          return 'ok';
                        }
                        if (value && value.length > 6) {
                          return 'pass';
                        }
                        return 'poor';
                      };
                      const status = getStatus();
                      if (status === 'pass') {
                        return (
                          <div>
                            强度：中
                          </div>
                        );
                      }
                      if (status === 'ok') {
                        return (
                          <div>
                            强度：强
                          </div>
                        );
                      }
                      return (
                        <div>强度：弱</div>
                      );
                    },
                  }}
                  placeholder={'密码: 123456'}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              </>
            )}
            {loginType === 'phone' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={'prefixIcon'} />,
                  }}
                  name="mobile"
                  placeholder={'手机号'}
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`;
                    }
                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <a
              style={{
                float: 'right',
              }}
              href="/login"
            >
              登录
            </a>
          </div>
          </LoginForm>
        </div>
      </ProConfigProvider>
    );
  };