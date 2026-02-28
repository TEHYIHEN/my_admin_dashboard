import CustomAvatar from '@/components/custom-avatar'
import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutation'
import { Edit, useForm } from '@refinedev/antd'
import { Col, Form, Row } from 'antd'
import React from 'react'

export const EditPage = () => {

    const { saveButtonProps, formProps, formLoading, query } = useForm({
        
        redirect:false,
        meta:{
            gqlMutation: UPDATE_COMPANY_MUTATION
        }
    });

    const {avatarUrl, name} = query?.data?.data || {} ;


  return (
    <div>
      <Row gutter={[32,32]}>
        <Col xs={24} xl={12} >
            <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} breadcrumb={false} >
                <Form layout='vertical' {...formProps} >
                    <CustomAvatar shape='square' src={avatarUrl}  />
                </Form>
            </Edit>
        </Col>
      </Row>
    </div>
  )
}


