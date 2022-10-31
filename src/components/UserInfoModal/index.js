import { Form, Modal } from "antd"
import {
   UserOutlined
  } from "@ant-design/icons";

import styles from "./modal.module.css"
import dayjs from "dayjs";

const UserInfoModal=({data,isVisible, ... props})=>{
    return(
        <Modal footer={null} title="User Info" visible={isVisible} {...props}>
            <div className={styles.content}>
                <div className={styles.avatar}>
                    <UserOutlined width='52px' />
                </div>
                <div className={styles.info}>
                    <Form labelCol={3} wrapperCol={18}>
                        <Form.Item label='Email'>
                            <p>{data?.email}</p>
                        </Form.Item>
                        <Form.Item label='Created at'>
                            <p>{dayjs(data?.createdAt).format('DD-MM-YYYY hh:mm')}</p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}

export default UserInfoModal