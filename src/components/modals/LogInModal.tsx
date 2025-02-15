import Button from '@components/Button'
import Column from '@components/Column'
import Input from '@components/Input'
import LoadingWheel from '@components/LoadingWheel'
import Modal from '@components/modals/Modal'
import SuccessMessage from '@components/SuccessMessage'
import { AccountContext } from '@contexts/AccountContext'
import config from '@src/Config'
import styles from '@styles/components/modals/Modal.module.scss'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useHistory, useLocation } from 'react-router-dom'

const LogInModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const {
        getAccountData,
        setRegisterModalOpen,
        setForgotPasswordModalOpen,
        setAccountDataLoading,
    } = useContext(AccountContext)
    const { executeRecaptcha } = useGoogleReCaptcha()

    type InputState = 'default' | 'valid' | 'invalid'

    const [emailOrHandle, setEmailOrHandle] = useState('')
    const [emailOrHandleState, setEmailOrHandleState] = useState<InputState>('default')
    const [emailOrHandleErrors, setEmailOrHandleErrors] = useState<string[]>([])

    const [password, setPassword] = useState('')
    const [passwordState, setPasswordState] = useState<InputState>('default')
    const [passwordErrors, setPasswordErrors] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [logInFlashMessage, setLogInFlashMessage] = useState('')
    const [displayResendVerificationEmailLink, setDisplayResendVerificationEmailLink] = useState(
        false
    )
    const [verificationEmailUserId, setVerificationEmailUserId] = useState(null)

    const location = useLocation()
    const history = useHistory()

    function logIn(e) {
        e.preventDefault()
        const invalidEmailOrHandle = emailOrHandle.length < 1
        const invalidPassword = password.length < 1
        setEmailOrHandleState(invalidEmailOrHandle ? 'invalid' : 'valid')
        setEmailOrHandleErrors(invalidEmailOrHandle ? ['Required'] : []) // Please enter your handle or email
        setPasswordState(invalidPassword ? 'invalid' : 'valid')
        setPasswordErrors(invalidPassword ? ['Required'] : []) // Please enter your password
        if (!invalidEmailOrHandle && !invalidPassword) {
            setLoading(true)
            executeRecaptcha('login').then((reCaptchaToken) => {
                axios
                    .post(`${config.apiURL}/log-in`, { reCaptchaToken, emailOrHandle, password })
                    .then((res) => {
                        setLoading(false)
                        setSuccess(true)
                        document.cookie = `accessToken=${res.data}; path=/`
                        setAccountDataLoading(true)
                        getAccountData()
                        setTimeout(() => {
                            if (location.pathname === '/') history.push('/s/all')
                            close()
                        }, 1000)
                    })
                    .catch((error) => {
                        setLoading(false)
                        switch (error.response.data.message) {
                            case 'User not found':
                                setEmailOrHandleState('invalid')
                                setEmailOrHandleErrors(['User not found'])
                                break
                            case 'Spam account':
                                setLogInFlashMessage(
                                    'Sorry, your account has been marked as spam. Email admin@weco.io if you think this is a mistake.'
                                )
                                break
                            case 'Incorrect password':
                                setPasswordState('invalid')
                                setPasswordErrors(['Incorrect password'])
                                break
                            case 'Email not yet verified':
                                setLogInFlashMessage('Email not yet verified')
                                setDisplayResendVerificationEmailLink(true)
                                setVerificationEmailUserId(error.response.data.userId)
                                break
                            default:
                                break
                        }
                    })
            })
        }
    }

    function resendVerificationEmail() {
        axios
            .post(`${config.apiURL}/resend-verification-email`, { userId: verificationEmailUserId })
            .then((res) => {
                if (res.data === 'user-not-found') setLogInFlashMessage('Account not found')
                if (res.data === 'success') {
                    setLogInFlashMessage(`We've sent you a new verification email.`)
                    setDisplayResendVerificationEmailLink(false)
                }
            })
    }

    useEffect(() => {
        // make recaptcha flag visible
        const recaptchaBadge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement
        if (recaptchaBadge) recaptchaBadge.style.visibility = 'visible'
        return () => {
            if (recaptchaBadge) recaptchaBadge.style.visibility = 'hidden'
        }
    }, [])

    return (
        <Modal close={close} centered>
            <h1>Log in</h1>
            <form onSubmit={logIn}>
                <Column style={{ marginBottom: 20, width: '100%' }}>
                    <Input
                        type='text'
                        title='Handle or email'
                        placeholder='handle or email...'
                        style={{ marginBottom: 10 }}
                        state={emailOrHandleState}
                        errors={emailOrHandleErrors}
                        value={emailOrHandle}
                        onChange={(newValue) => {
                            setEmailOrHandleState('default')
                            setEmailOrHandle(newValue)
                        }}
                        autoFill
                    />
                    <Input
                        type='password'
                        title='Password'
                        placeholder='password...'
                        style={{ marginBottom: 10 }}
                        state={passwordState}
                        errors={passwordErrors}
                        value={password}
                        onChange={(newValue) => {
                            setPasswordState('default')
                            setPassword(newValue)
                        }}
                        autoFill
                    />
                </Column>
                {logInFlashMessage.length > 0 && (
                    <p className='danger' style={{ marginBottom: 20 }}>
                        {logInFlashMessage}
                    </p>
                )}
                {displayResendVerificationEmailLink && (
                    <Button
                        text='Resend verification email'
                        color='blue'
                        style={{ marginBottom: 10 }}
                        onClick={() => resendVerificationEmail()}
                    />
                )}
                {!loading && !success && (
                    <Button
                        text='Log in'
                        color='blue'
                        disabled={
                            emailOrHandleState === 'invalid' ||
                            passwordState === 'invalid' ||
                            !!logInFlashMessage.length
                        }
                        submit
                    />
                )}
                {loading && <LoadingWheel />}
                {success && <SuccessMessage text='Logged in' />}
                <Column style={{ marginTop: 20 }} centerX>
                    <p>
                        New?{' '}
                        <button
                            type='button'
                            className={styles.textButton}
                            onClick={() => {
                                setRegisterModalOpen(true)
                                close()
                            }}
                        >
                            Create a new account
                        </button>
                    </p>
                    <p>
                        <button
                            type='button'
                            className={styles.textButton}
                            onClick={() => {
                                setForgotPasswordModalOpen(true)
                                close()
                            }}
                        >
                            Forgot your password?
                        </button>
                    </p>
                </Column>
            </form>
        </Modal>
    )
}

export default LogInModal
