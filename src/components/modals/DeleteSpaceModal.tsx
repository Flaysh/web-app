import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import Modal from '@components/modals/Modal'
import SuccessMessage from '@components/SuccessMessage'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import styles from '@styles/components/modals/Modal.module.scss'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Cookies from 'universal-cookie'

const DeleteSpaceModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData } = useContext(SpaceContext)
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()
    const history = useHistory()

    function deleteSpace(e) {
        e.preventDefault()
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        const data = { spaceId: spaceData.id }
        axios
            .post(`${config.apiURL}/delete-space`, data, authHeader)
            .then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        // setInputState('invalid')
                        // setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        // setInputState('invalid')
                        // setInputErrors([
                        //     `Unauthorized. You must be a moderator of ${spaceData.name} to complete this action.`,
                        // ])
                        break
                    case 'success': {
                        // todo: remove deleted space from followed/moderted spaces in account
                        setShowSuccessMessage(true)
                        setTimeout(() => history.push(`/s/all`), 3000)
                        break
                    }
                    default:
                        break
                }
            })
            .catch((error) => console.log(error))
    }

    return (
        <Modal centered close={close} style={{ maxWidth: 600 }}>
            <h1>Delete &apos;{spaceData.name}&apos;</h1>
            <p>Are you sure you want to permanently delete &apos;{spaceData.name}&apos;?</p>
            <p>
                All contained child-spaces with no other parents will be re-attached to the root
                space <Link to='/s/all/spaces'>all</Link>.
            </p>
            <form onSubmit={deleteSpace}>
                <div className={styles.footer}>
                    <Button
                        submit
                        text='Delete space'
                        color='red'
                        style={{ marginRight: 10 }}
                        disabled={loading}
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='Space deleted' />}
                </div>
            </form>
        </Modal>
    )
}

export default DeleteSpaceModal
