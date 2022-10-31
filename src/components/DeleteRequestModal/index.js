import { Modal } from "antd"

const DeleteRequestModal=({...props})=>{
    return(
        <Modal title='Confirm Delete' {...props}>
            Are you sure to cancel this request?
        </Modal>
    )
}

export default DeleteRequestModal