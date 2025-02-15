import FlagImage from '@components/FlagImage'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import { dateCreated, timeSinceCreated } from '@src/Helpers'
import styles from '@styles/components/SpaceNotificationCard.module.scss'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SpaceNotificationCard = (props: {
    notification: any
    // index: number
    getRequestsData: () => void
}): JSX.Element => {
    const { notification, getRequestsData } = props

    const { accountData } = useContext(AccountContext)
    const { spaceData, getSpaceData } = useContext(SpaceContext)

    const [seen, setSeen] = useState(true)

    useEffect(() => {
        if (notification.id) {
            setSeen(notification.seen)
        }
    }, [notification.id])

    function toggleSeen() {
        setSeen(!seen)
        axios
            .post(`${config.apiURL}/toggle-space-notification-seen`, {
                notificationId: notification.id,
                seen: !seen,
            })
            .then((res) => {
                if (res.data === 'success') {
                    // todo: update context directly
                    // setTimeout(() => {
                    //     getSpaceData()
                    // }, 300)
                }
            })
    }
    function acceptParentSpaceRequest() {
        axios
            .post(`${config.apiURL}/accept-parent-space-request`, {
                notificationId: notification.id,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setTimeout(() => {
                        getRequestsData()
                    }, 300)
                }
            })
    }

    function rejectParentSpaceRequest() {
        axios
            .post(`${config.apiURL}/reject-parent-space-request`, {
                notificationId: notification.id,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setTimeout(() => {
                        getRequestsData()
                    }, 300)
                }
            })
    }

    return (
        <div className={`${styles.wrapper} ${seen && styles.seen}`}>
            {/* <div className={styles.index}>{ index + 1 }</div> */}

            {notification.type === 'parent-space-request' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            className={styles.iconLarge}
                            src='/icons/overlapping-circles-thick.svg'
                            alt=''
                        />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                        >
                            <FlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>requested</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.triggerSpace.handle}`}
                        >
                            <FlagImage
                                type='space'
                                size={30}
                                imagePath={notification.triggerSpace.flagImagePath}
                            />
                            <span>{notification.triggerSpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>become a child space of</div>
                        <Link className={styles.imageTextLink} to={`/s/${spaceData.handle}`}>
                            <FlagImage
                                type='space'
                                size={30}
                                imagePath={spaceData.flagImagePath || null}
                            />
                            <span>{spaceData.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>•</div>
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            {timeSinceCreated(notification.createdAt)}
                        </div>
                        {notification.state === 'pending' && (
                            <>
                                <div className={`${styles.text} ml-10`}>•</div>
                                <div
                                    className={styles.linkText}
                                    role='button'
                                    tabIndex={0}
                                    onClick={acceptParentSpaceRequest}
                                    onKeyDown={acceptParentSpaceRequest}
                                >
                                    Accept
                                </div>
                                <div className={`${styles.text} ml-10`}>•</div>
                                <div
                                    className={styles.linkText}
                                    role='button'
                                    tabIndex={0}
                                    onClick={rejectParentSpaceRequest}
                                    onKeyDown={rejectParentSpaceRequest}
                                >
                                    Reject
                                </div>
                            </>
                        )}
                        {notification.state === 'accepted' && (
                            <>
                                <div className={`${styles.text} ml-10 mr-10`}>•</div>
                                <img
                                    className={styles.checkIcon}
                                    src='/icons/check-circle-regular.svg'
                                    alt=''
                                />
                                <div className={`${styles.text} mr-10`}>Accepted</div>
                            </>
                        )}
                        {notification.state === 'rejected' && (
                            <>
                                <div className={`${styles.text} ml-10 mr-10`}>•</div>
                                <img
                                    className={styles.timesIcon}
                                    src='/icons/times-circle-regular.svg'
                                    alt=''
                                />
                                <div className={`${styles.text} mr-10`}>Rejected</div>
                            </>
                        )}
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpaceNotificationCard
