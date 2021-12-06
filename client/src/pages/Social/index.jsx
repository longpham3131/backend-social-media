import { Avatar, Layout, Menu, message, Dropdown } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    DownOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './styles/index.scss'
import { getMyProfileAction } from 'store/user/user.action';
import userAPI from 'apis/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import getFirstLetter from 'util/getFirstLetter';
import { getUrlImage } from 'util/index';
import { useHistory } from 'react-router';

const { Header, Sider, Content } = Layout;


const Social = () => {
    const dispatch = useDispatch();
    const myProfile = useSelector(state => state?.userReducer?.myProfile)
    const [collapsed, setCollapsed] = useState(false);
    let history = useHistory();
    const toggle = () => {
        setCollapsed(!collapsed);
    }
    const logOut = () => {
        localStorage.clear();
        history.push("/login")
        window.location.reload();
    }
    const menu = (
        <Menu>
            <Menu.Item>
                <p>Trang cá nhân</p>
            </Menu.Item>
            <Menu.Item ><p onClick={logOut}>Đăng xuất</p></Menu.Item>
        </Menu>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        try {
            const myProfile = await userAPI.getMyProfile();
            dispatch(getMyProfileAction(myProfile.data))
            message.success("Chào mừng bạn quay lại");
        }
        catch (error) {
            console.log("error-newsfeed", error);
        }
    }, [])
    return (<Layout className="w-full h-screen newsfeed">
        <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Bảng tin
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    Trang cá nhân
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                    Tìm kiếm bạn bè
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
                <div className="flex items-center justify-between mx-[1.6rem]">
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    <Dropdown overlay={menu}>
                        <div className="flex items-center gap-[0.8rem]">
                            <Avatar size={40} src={getUrlImage(myProfile?.avatar)}>{getFirstLetter(myProfile?.fullName)}</Avatar>
                            <span className=" text-base text-gray-500">{myProfile?.fullName}</span>
                        </div>
                    </Dropdown>
                </div>
            </Header>
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                Content
            </Content>
        </Layout>
    </Layout>)
}

export default Social