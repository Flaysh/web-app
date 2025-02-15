import Button from '@components/Button'
import Input from '@components/Input'
import LoadingWheel from '@components/LoadingWheel'
import Modal from '@components/modals/Modal'
import SuccessMessage from '@components/SuccessMessage'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import styles from '@styles/components/modals/Modal.module.scss'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import Cookies from 'universal-cookie'

const UpdateSpaceHandleModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData, setSpaceData } = useContext(SpaceContext)
    const [inputValue, setInputValue] = useState(spaceData.name || '')
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    function updateSpaceName(e) {
        e.preventDefault()
        const unChanged = inputValue === spaceData.name
        const invalid = inputValue.length < 1 || inputValue.length > 30
        if (unChanged) {
            setInputState('invalid')
            setInputErrors([`Already saved as '${inputValue}'`])
        } else if (invalid) {
            setInputState('invalid')
            setInputErrors(['Must be between 1 and 30 characters'])
        } else {
            setInputState('valid')
            setLoading(true)
            const data = { spaceId: spaceData.id, payload: inputValue }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios.post(`${config.apiURL}/update-space-name`, data, authHeader).then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        setInputState('invalid')
                        setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        setInputState('invalid')
                        setInputErrors([
                            `Unauthorized. You must be a moderator of ${spaceData.name} to complete this action.`,
                        ])
                        break
                    case 'success':
                        setSpaceData({ ...spaceData, name: inputValue })
                        setShowSuccessMessage(true)
                        setTimeout(() => close(), 2000)
                        break
                    default:
                        break
                }
            })
        }
    }

    return (
        <Modal centered close={close}>
            <h1>Change the name for {spaceData.name}</h1>
            <p>This will be the main visible name for your space</p>
            <form onSubmit={updateSpaceName}>
                <Input
                    type='text'
                    title='New name:'
                    placeholder='name...'
                    state={inputState}
                    errors={inputErrors}
                    value={inputValue}
                    onChange={(newValue) => {
                        setInputState('default')
                        setInputValue(newValue)
                    }}
                />
                <div className={styles.footer}>
                    {!showSuccessMessage && (
                        <Button
                            text='Save'
                            color='blue'
                            style={{ marginRight: 10 }}
                            disabled={loading || inputState === 'invalid'}
                            submit
                        />
                    )}
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='New name saved!' />}
                </div>
            </form>
        </Modal>
    )
}

export default UpdateSpaceHandleModal
