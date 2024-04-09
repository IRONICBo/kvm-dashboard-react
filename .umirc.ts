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
        title: '申威测试脚本集成管理',
    },
    routes: [
        {
            path: '/',
            // redirect: '/virtual/manage',
            redirect: '/plugin/node',
        },
        // {
        //     name: '资源池控制模块',
        //     path: '/virtual',
        //     routes: [
        //         {
        //             name: '宿主机管理',
        //             path: '/virtual/host',
        //             component: './HostManage',
        //         },
        //         {
        //             name: '虚拟机管理',
        //             path: '/virtual/manage',
        //             component: './VmManage',
        //         },
        //         {
        //             name: '网络管理',
        //             path: '/virtual/network',
        //             component: './VmNetwork',
        //         },
        //         {
        //             name: '镜像管理',
        //             path: '/virtual/mirror',
        //             component: './VmMirror',
        //         },
        //         {
        //             name: '磁盘管理',
        //             path: '/virtual/volume',
        //             component: './VmVolume',
        //         },
        //         {
        //             name: '计算规格管理',
        //             path: '/virtual/instance',
        //             component: './VmInstance',
        //         },
        //         {
        //             name: '云盘规格管理',
        //             path: '/virtual/disk',
        //             component: './VmDisk',
        //         },
        //     ]
        // },
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
            name: '测试脚本集成模块',
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
            name: '测试操作录制与重播模块',
            path: '/record',
            routes: [
                {
                    name: '测试节点管理',
                    path: '/record/node',
                    component: './PluginNodeManage',
                },
                // {
                //     name: '插件管理',
                //     path: '/record/manage',
                //     component: './PluginManage',
                // },
                // {
                //     name: '插件测试',
                //     path: '/record/runner',
                //     component: './Plugin',
                // },
                // {
                //     name: '测试历史',
                //     path: '/record/history',
                //     component: './PluginHistory',
                // },
            ]
        },
        {
            name: '存储服务测试模块',
            path: '/storage',
            routes: [
                {
                    name: '测试节点管理',
                    path: '/storage/node',
                    component: './PluginNodeManage',
                },
                {
                    name: '插件管理',
                    path: '/storage/manage',
                    component: './StoragePlugManage',
                },
                {
                    name: '插件测试',
                    path: '/storage/runner',
                    component: './Plugin',
                },
                {
                    name: '测试历史',
                    path: '/storage/history',
                    component: './PluginHistory',
                },
            ]
        },
        {
            name: '计算服务测试模块',
            path: '/compute',
            routes: [
                {
                    name: '测试节点管理',
                    path: '/compute/node',
                    component: './PluginNodeManage',
                },
                {
                    name: '插件管理',
                    path: '/compute/manage',
                    component: './ComputePlugManage',
                },
                {
                    name: '插件测试',
                    path: '/compute/runner',
                    component: './Plugin',
                },
                {
                    name: '测试历史',
                    path: '/compute/history',
                    component: './PluginHistory',
                },
            ]
        },
        {
            name: '界面展示模块-资源动态监控模块',
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
            name: '界面展示模块-服务质量监控模块',
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
            name: '对外接口模块',
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

