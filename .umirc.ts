import {defineConfig} from '@umijs/max';

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: '虚拟机运维平台',
    },
    routes: [
        {
            path: '/',
            redirect: '/virtual/manage',
        },
        {
            name: '宿主机管理',
            path: '/host',
            icon: 'tool',
            component: './HostManage',
        },
        {
            name: '虚拟机管理',
            path: '/virtual/manage',
            icon: 'table',
            component: './VmManage',
        },
        {
            name: '虚拟机创建',
            path: '/virtual/create',
            icon: 'crown',
            component: './VmCreate',
        },
        {
            name: '监控',
            path: '/monitor',
            icon: 'table',
            component: './Monitor',
            hideInMenu: true,
        },
    ],
    npmClient: 'pnpm',
});

