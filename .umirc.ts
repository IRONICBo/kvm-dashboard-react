import {defineConfig} from '@umijs/max';

export default defineConfig({
    antd: {
        // dark: true,
    },
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
        // {
        //     name: '虚拟机创建',
        //     path: '/virtual/create',
        //     icon: 'crown',
        //     component: './VmCreate',
        // },
        {
            name: '网络管理',
            path: '/virtual/network',
            icon: 'network',
            component: './VmNetwork',
        },
        {
            name: '虚拟机镜像',
            path: '/virtual/mirror',
            icon: 'mirror',
            component: './VmMirror',
        },
        {
            name: '虚拟机快照',
            path: '/virtual/snapshot',
            icon: 'snapshot',
            component: './VmSnapshot',
        },
        {
            name: '计算规格',
            path: '/virtual/instance',
            icon: 'instance',
            component: './VmInstance',
        },
        {
            name: '云盘规格',
            path: '/virtual/disk',
            icon: 'disk',
            component: './VmDisk',
        },
        {
            name: '监控',
            path: '/monitor',
            icon: 'table',
            component: './Monitor',
            hideInMenu: true,
        },
        // TODO: Update Create VM Machine
        {
            name: '性能指标',
            path: '/performance',
            icon: 'info',
            component: './Performance',
        },
        {
            name: '插件测试',
            path: '/plugin',
            icon: 'T',
            component: './Plugin',
        },
    ],
    npmClient: 'pnpm',
});

