import { Text } from '@/components/text';
import { User } from '@/graphql/schema.types'
import { DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Dropdown, theme } from 'antd';
import { MenuProps } from 'antd/lib';
import React, { useMemo } from 'react'

type ProjectCardProps = {
  id: string,
  title: string,
  updatedAt: string,
  dueDate?: string,
  users?:{

    id:string,
    name:string,
    avatarUrl?:User["avatarUrl"],
  }[];
}

const ProjectCard = ({id, title, dueDate, users}: ProjectCardProps) => {
    
    //theme.useToken() 用来对接与调用什么样式
    const {token} = theme.useToken();
    //console.log(token);

    const edit = () => {}

    const dropdownItems = useMemo(() => {
        const items: MenuProps["items"] = [
            {
                label: "View card",
                key: "1",
                icon: <EyeOutlined />,
                onClick: () => {
                    edit();
                }
            },
            {
                danger: true,
                label: "Delete card",
                key: "2",
                icon: <DeleteOutlined />,
                onClick: () => {
                    
                }
            }
        ];

        return items;
    }, []);


  return (
    // ConfigProvider是一键式可以改变全局的主题(theme),font
    <ConfigProvider
        theme={{
            components:{
                Tag:{
                    colorText: token.colorTextSecondary,
                },
                Card:{
                    headerBg:"transparent",
                }
            }
        }}
    >
        <Card
            size='small'
            title={<Text ellipsis={{tooltip: title}}>{title}</Text>}
            onClick={()=> edit()}
            extra={
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: dropdownItems,
                    }}
                    placement='bottom'
                    arrow={{pointAtCenter: true}}
                >
                    <Button 
                        type='text'
                        shape='circle'
                        icon={
                            <MoreOutlined 
                                style={{transform:"rotate(90deg)"}}
                            />
                            }
                        onPointerDown={(e) => {e.stopPropagation()}}
                        onClick={(e) => {e.stopPropagation()}}

                    />

                </Dropdown>
            }
        >

        </Card>

    </ConfigProvider>
  )
}

export default ProjectCard
