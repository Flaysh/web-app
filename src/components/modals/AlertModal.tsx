import Button from '@components/Button'
import Modal from '@components/modals/Modal'
import { AccountContext } from '@contexts/AccountContext'
import React, { useContext } from 'react'

const AlertModal = (): JSX.Element => {
    const { setAlertModalOpen, alertMessage, setLogInModalOpen } = useContext(AccountContext)

    const logIn = () => {
        setLogInModalOpen(true)
        setAlertModalOpen(false)
    }

    return (
        <Modal close={() => setAlertModalOpen(false)} centered>
            <h1 style={{ textAlign: 'center' }}>{alertMessage}</h1>
            {alertMessage.includes('Log in') ? (
                <Button text='Log in' color='blue' onClick={() => logIn()} />
            ) : (
                <Button text='Ok' color='blue' onClick={() => setAlertModalOpen(false)} />
            )}
        </Modal>
    )
}

export default AlertModal
