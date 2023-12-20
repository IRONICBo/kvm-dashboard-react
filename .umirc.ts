import {defineConfig} from '@umijs/max';

export default defineConfig({
    antd: {
        dark: false,
    },
    theme: {
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
            icon: 'H',
            component: './HostManage',
        },
        {
            name: '虚拟机管理',
            path: '/virtual/manage',
            icon: 'V',
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
            icon: 'N',
            component: './VmNetwork',
        },
        {
            name: '镜像管理',
            path: '/virtual/mirror',
            icon: 'M',
            component: './VmMirror',
        },
        {
            name: '磁盘管理',
            path: '/virtual/volume',
            icon: 'D',
            component: './VmVolume',
        },
        // {
        //     name: '快照管理',
        //     path: '/virtual/snapshot',
        //     icon: 'S',
        //     component: './VmSnapshot',
        // },
        {
            name: '计算规格管理',
            path: '/virtual/instance',
            icon: 'I',
            component: './VmInstance',
        },
        {
            name: '云盘规格管理',
            path: '/virtual/disk',
            icon: 'D',
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
            icon: 'P',
            component: './Performance',
        },
        {
            name: '插件测试',
            path: '/plugin',
            icon: 'T',
            component: './Plugin',
        },
        {
            name: '系统管理',
            path: '/system/manage',
            icon: 'S',
            component: './SystemManage',
        }
    ],
    npmClient: 'pnpm',
});

