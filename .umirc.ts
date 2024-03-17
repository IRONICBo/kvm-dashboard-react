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
            name: '资源池控制模块',
            path: '/virtual',
            routes: [
                {
                    name: '宿主机管理',
                    path: '/virtual/host',
                    component: './HostManage',
                },
                {
                    name: '虚拟机管理',
                    path: '/virtual/manage',
                    component: './VmManage',
                },
                {
                    name: '网络管理',
                    path: '/virtual/network',
                    component: './VmNetwork',
                },
                {
                    name: '镜像管理',
                    path: '/virtual/mirror',
                    component: './VmMirror',
                },
                {
                    name: '磁盘管理',
                    path: '/virtual/volume',
                    component: './VmVolume',
                },
                {
                    name: '计算规格管理',
                    path: '/virtual/instance',
                    component: './VmInstance',
                },
                {
                    name: '云盘规格管理',
                    path: '/virtual/disk',
                    component: './VmDisk',
                },
            ]
        },
        // {
        //     name: '虚拟机创建',
        //     path: '/virtual/create',
        //     icon: 'crown',
        //     component: './VmCreate',
        // },
        // {
        //     name: '快照管理',
        //     path: '/virtual/snapshot',
        //     icon: 'S',
        //     component: './VmSnapshot',
        // },
        // TODO: Update Create VM Machine
        {
            name: '插件测试',
            path: '/plugin',
            routes: [
                {
                    name: '测试节点管理',
                    path: '/plugin/node',
                    component: './PluginNodeManage',
                },
                {
                    name: '插件管理',
                    path: '/plugin/manage',
                    component: './PluginManage',
                },
                {
                    name: '插件测试',
                    path: '/plugin/runner',
                    component: './Plugin',
                },
                {
                    name: '测试历史',
                    path: '/plugin/history',
                    component: './PluginHistory',
                },
            ]
        },
        {
            name: '资源动态监控模块',
            path: '/system',
            routes: [
                {
                    name: '系统管理',
                    path: '/system/manage',
                    component: './SystemManage',
                },
                {
                    name: '节点监控',
                    path: '/system/monitor',
                    component: './Monitor',
                    // hideInMenu: true,
                },
            ],
        },
        {
            name: '服务质量监控模块',
            path: '/service',
            routes: [
                {
                    name: '服务质量',
                    path: '/service/manage',
                    component: './ServiceManage',
                },
                {
                    name: '性能指标',
                    path: '/service/performance',
                    component: './Performance',
                },
            ],
        },
        {
            name: '用户权限管理模块',
            path: '/user',
            routes: [
                {
                    name: '用户管理',
                    path: '/user/manage',
                    component: './UserManage',
                },
            ]
        },
        {
            name: '外部接口模块',
            path: '/api',
            routes: [
                {
                    name: '外部接口文档',
                    path: '/api/doc',
                    component: './ApiDoc',
                },
            ]
        }
    ],
    npmClient: 'pnpm',
});

