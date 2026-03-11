import { Text } from '@/components/text'
import { PlusOutlined } from '@ant-design/icons'
import { useDroppable, UseDroppableArguments } from '@dnd-kit/core'
import { Badge, Button, Space } from 'antd'
import React from 'react'

type MycolumnProps = {

    id: string;
    title: string;
    description?: React.ReactNode;
    count: number;
    data?: UseDroppableArguments["data"];
    onAddClick?: (args: {id: string}) => void;

}

const KanbanColumn = ({
    
    children,
    id,
    title,
    description,
    count,
    data,
    onAddClick

}: React.PropsWithChildren<MycolumnProps>) => {

    const {isOver, setNodeRef, active} = useDroppable({

        id,
        data

    });

    // const count = 2;
    // const description = "Description";
    // const title = "Title";

    const onAddClickHandler = () => {

        onAddClick?.({id})

    }

  return (
    <div
        ref={setNodeRef}
        style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 16px"
        }}
    >
        <div style={{padding: "12px"}}>
            <Space style={{width:"100%" , justifyContent:"space-between"}}>

                {/* ellipsis是限制文字的长度
                    当文字太长，超过了container的 width, 然后后面的文字变成(...)
                */}
                <Text 
                    ellipsis={{ tooltip: title}}
                    size='xs'
                    strong
                    style={{
                        textTransform:"uppercase",
                        whiteSpace: "nowrap"
                    }}
                >
                    {title}
                    
                </Text>
                {!!count && <Badge count={count} color="cyan" />}
                
                <Button
                    shape='circle'
                    icon={<PlusOutlined  />}
                    onClick={onAddClickHandler}
                    size='small'
                />
            </Space>
                
                {description}
        
        </div>

        <div
            style={{
                flex : 1,
                //当没有drag action，allow container scrolling
                //当在drag action时，取消scrolling 效果
                overflowY: active ? "unset" : "scroll",
                border: "2px dashed transparent",
                borderColor: isOver ? "#00040" : "transparent",
                borderRadius: "4px"
            }}
        >
            <div
                style={{
                    marginTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}
            >
                {children}
            </div>
        </div>

    </div>
  )
}

export default KanbanColumn
