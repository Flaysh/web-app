/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/control-has-associated-label */
import Button from '@components/Button'
import Column from '@components/Column'
import FlagImage from '@components/FlagImage'
import GlobalSearchBar from '@components/GlobalSearchBar'
import ImageTitle from '@components/ImageTitle'
import Row from '@components/Row'
import Scrollbars from '@components/Scrollbars'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import { UserContext } from '@contexts/UserContext'
import SpaceNavigationList from '@pages/SpacePage/SpaceNavigationList'
import styles from '@styles/components/Navbar.module.scss'
import { ReactComponent as BellIcon } from '@svgs/bell-solid.svg'
import { ReactComponent as AboutIcon } from '@svgs/book-open-solid.svg'
import { ReactComponent as GovernanceIcon } from '@svgs/building-columns-solid.svg'
import { ReactComponent as CalendarIcon } from '@svgs/calendar-days-solid.svg'
import { ReactComponent as ChevronDownIcon } from '@svgs/chevron-down-solid.svg'
import { ReactComponent as SettingsIcon } from '@svgs/cog-solid.svg'
import { ReactComponent as PostsIcon } from '@svgs/edit-solid.svg'
import { ReactComponent as SpacesIcon } from '@svgs/overlapping-circles-thick.svg'
import { ReactComponent as SearchIcon } from '@svgs/search.svg'
import { ReactComponent as TreeIcon } from '@svgs/tree-icon.svg'
import { ReactComponent as UserIcon } from '@svgs/user-solid.svg'
import { ReactComponent as PeopleIcon } from '@svgs/users-solid.svg'
import { ReactComponent as WecoLogo } from '@svgs/weco-logo.svg'
import React, { useContext, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

const Navbar = (): JSX.Element => {
    const {
        loggedIn,
        accountData,
        accountDataLoading,
        setLogInModalOpen,
        setDonateModalOpen,
        logOut,
    } = useContext(AccountContext)
    const { spaceData, getSpaceData, isModerator, selectedSpaceSubPage } = useContext(SpaceContext)
    const { userData } = useContext(UserContext)
    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false)
    const [accountMenuOpen, setAccountMenuOpen] = useState(false)
    const [searchDropDownOpen, setSearchDropDownOpen] = useState(false)
    const [exploreDropDownOpen, setExploreDropDownOpen] = useState(false)
    const [profileDropDownOpen, setProfileDropDownOpen] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const otherUsersPage =
        location.pathname.split('/')[1] === 'u' &&
        location.pathname.split('/')[2] !== accountData.handle

    function rotateButton() {
        const homeButton = document.getElementById('home-button')
        if (homeButton) {
            if (!homeButton.style.transform) homeButton.style.transform = 'rotate(-360deg)'
            else {
                const degrees = homeButton.style.transform.split('-')[1].split('d')[0]
                homeButton.style.transform = `rotate(-${+degrees + 360}deg)`
            }
        }
    }

    function toggleHamburgerMenu() {
        const menu = document.getElementById('mobile-left')
        if (menu) {
            if (hamburgerMenuOpen) {
                // close
                menu.classList.remove(styles.entering)
                menu.classList.add(styles.exiting)
                setTimeout(() => setHamburgerMenuOpen(false), 500)
            } else {
                // open
                if (!accountDataLoading && !spaceData.id) getSpaceData('all')
                if (searchDropDownOpen) toggleSearchDropDown()
                if (accountMenuOpen) toggleAccountMenu()
                setHamburgerMenuOpen(true)
                menu.classList.remove(styles.exiting)
                setTimeout(() => menu.classList.add(styles.entering), 50)
            }
        }
    }

    function toggleSearchDropDown() {
        const menu = document.getElementById('mobile-center')
        if (menu) {
            if (searchDropDownOpen) {
                // close
                menu.classList.remove(styles.entering)
                menu.classList.add(styles.exiting)
                setTimeout(() => setSearchDropDownOpen(false), 800)
            } else {
                // open
                if (hamburgerMenuOpen) toggleHamburgerMenu()
                if (accountMenuOpen) toggleAccountMenu()
                setSearchDropDownOpen(true)
                menu.classList.remove(styles.exiting)
                setTimeout(() => menu.classList.add(styles.entering), 50)
            }
        }
    }

    function toggleAccountMenu() {
        const menu = document.getElementById('mobile-right')
        if (menu) {
            if (accountMenuOpen) {
                // close
                menu.classList.remove(styles.entering)
                menu.classList.add(styles.exiting)
                setTimeout(() => setAccountMenuOpen(false), 500)
            } else {
                // open
                if (hamburgerMenuOpen) toggleHamburgerMenu()
                if (searchDropDownOpen) toggleSearchDropDown()
                setAccountMenuOpen(true)
                menu.classList.remove(styles.exiting)
                setTimeout(() => menu.classList.add(styles.entering), 50)
            }
        }
    }

    return (
        <Row spaceBetween className={styles.wrapper}>
            <Row centerY id='mobile-left' className={styles.mobileLeft}>
                <button type='button' onClick={() => toggleHamburgerMenu()}>
                    <TreeIcon />
                </button>
                {hamburgerMenuOpen && (
                    <>
                        <button
                            className={styles.hamburgerMenuBackground}
                            type='button'
                            onClick={() => toggleHamburgerMenu()}
                        />
                        <Column className={styles.hamburgerMenu}>
                            <Column centerY style={{ marginBottom: 15 }}>
                                <Row centerY>
                                    <button
                                        type='button'
                                        className={styles.homeButton}
                                        onClick={() => {
                                            toggleHamburgerMenu()
                                            history.push('/')
                                        }}
                                    >
                                        <WecoLogo />
                                    </button>
                                    <Link to='/' onClick={() => toggleHamburgerMenu()}>
                                        <p>Home page</p>
                                    </Link>
                                </Row>
                                {(otherUsersPage ||
                                    (spaceData.id !== 1 &&
                                        !spaceData.DirectParentHolons.map((s) => s.id).includes(
                                            1
                                        ))) && (
                                    <ImageTitle
                                        type='space'
                                        imagePath='https://weco-prod-space-flag-images.s3.eu-west-1.amazonaws.com/1614556880362'
                                        title='All'
                                        link={`/s/all/${selectedSpaceSubPage}`}
                                        fontSize={14}
                                        imageSize={35}
                                        onClick={() => toggleHamburgerMenu()}
                                        wrapText
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                            </Column>
                            <Row centerY className={styles.hamburgerMenuHeader}>
                                <FlagImage
                                    type={otherUsersPage ? 'user' : 'space'}
                                    size={80}
                                    imagePath={
                                        otherUsersPage
                                            ? userData.flagImagePath
                                            : spaceData.flagImagePath
                                    }
                                    style={{ marginRight: 10 }}
                                />
                                <Column>
                                    <h1>{otherUsersPage ? userData.name : spaceData.name}</h1>
                                    <p className='grey'>
                                        {otherUsersPage
                                            ? `u/${userData.handle}`
                                            : `s/${spaceData.handle}`}
                                    </p>
                                </Column>
                            </Row>
                            {otherUsersPage ? (
                                <Column className={styles.hamburgerMenuTabs}>
                                    <Link
                                        to={`/u/${userData.handle}/about`}
                                        onClick={() => toggleHamburgerMenu()}
                                    >
                                        <AboutIcon />
                                        <p>About</p>
                                    </Link>
                                    <Link
                                        to={`/u/${userData.handle}/posts`}
                                        onClick={() => toggleHamburgerMenu()}
                                    >
                                        <PostsIcon />
                                        <p>Posts</p>
                                    </Link>
                                </Column>
                            ) : (
                                <>
                                    <Column className={styles.hamburgerMenuTabs}>
                                        <Link
                                            to={`/s/${spaceData.handle}/about`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <AboutIcon />
                                            <p>About</p>
                                        </Link>
                                        <Link
                                            to={`/s/${spaceData.handle}/posts`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <PostsIcon />
                                            <p>Posts</p>
                                        </Link>
                                        <Link
                                            to={`/s/${spaceData.handle}/spaces`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <SpacesIcon />
                                            <p>Spaces</p>
                                        </Link>
                                        <Link
                                            to={`/s/${spaceData.handle}/people`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <PeopleIcon />
                                            <p>People</p>
                                        </Link>
                                        <Link
                                            to={`/s/${spaceData.handle}/calendar`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <CalendarIcon />
                                            <p>Calendar</p>
                                        </Link>
                                        <Link
                                            to={`/s/${spaceData.handle}/governance`}
                                            onClick={() => toggleHamburgerMenu()}
                                        >
                                            <GovernanceIcon />
                                            <p>Governance</p>
                                        </Link>
                                        {isModerator && (
                                            <Link
                                                to={`/s/${spaceData.handle}/settings`}
                                                onClick={() => toggleHamburgerMenu()}
                                            >
                                                <SettingsIcon />
                                                <p>Settings</p>
                                            </Link>
                                        )}
                                    </Column>
                                    <SpaceNavigationList
                                        onLocationChange={() => toggleHamburgerMenu()}
                                    />
                                </>
                            )}
                        </Column>
                    </>
                )}
            </Row>
            <Row centerY className={styles.desktopLeft}>
                <button
                    type='button'
                    id='home-button'
                    className={styles.homeButton}
                    onClick={() => {
                        rotateButton()
                        history.push('/')
                    }}
                >
                    <WecoLogo />
                </button>
                <div
                    className={styles.exploreButton}
                    onMouseEnter={() => setExploreDropDownOpen(true)}
                    onMouseLeave={() => setExploreDropDownOpen(false)}
                >
                    <Link to='/s/all/spaces'>Explore</Link>
                    <ChevronDownIcon />
                    {exploreDropDownOpen && (
                        <div className={styles.exploreDropDown}>
                            <Link to='/s/all/posts'>
                                <PostsIcon />
                                <p>Posts</p>
                            </Link>
                            <Link to='/s/all/spaces'>
                                <SpacesIcon />
                                <p>Spaces</p>
                            </Link>
                            <Link to='/s/all/people'>
                                <PeopleIcon />
                                <p>People</p>
                            </Link>
                            <Link to='/s/all/calendar'>
                                <CalendarIcon />
                                <p>Events</p>
                            </Link>
                        </div>
                    )}
                </div>
            </Row>
            <Row centerY id='mobile-center' className={styles.mobileCenter}>
                <button type='button' onClick={() => toggleSearchDropDown()}>
                    <SearchIcon />
                </button>
                {searchDropDownOpen && (
                    <>
                        <button
                            className={styles.mobileSearchBackground}
                            type='button'
                            onClick={() => toggleSearchDropDown()}
                        />
                        <Row centerY centerX className={styles.mobileSearchDropDown}>
                            <GlobalSearchBar
                                onLocationChange={() => toggleSearchDropDown()}
                                style={{ width: '100%', margin: '0 10px' }}
                            />
                        </Row>
                    </>
                )}
            </Row>
            <Row centerY className={styles.desktopCenter}>
                <GlobalSearchBar />
            </Row>
            {loggedIn ? (
                <>
                    <Row centerY id='mobile-right' className={styles.mobileRight}>
                        <button type='button' onClick={() => toggleAccountMenu()}>
                            <UserIcon />
                        </button>
                        {accountMenuOpen && (
                            <>
                                <button
                                    className={styles.accountMenuBackground}
                                    type='button'
                                    onClick={() => toggleAccountMenu()}
                                />
                                <Column className={styles.accountMenu}>
                                    <Row centerY className={styles.accountMenuHeader}>
                                        <FlagImage
                                            type='user'
                                            size={80}
                                            imagePath={accountData.flagImagePath}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Column>
                                            <h1>{accountData.name}</h1>
                                            <p className='grey'>u/{accountData.handle}</p>
                                        </Column>
                                    </Row>
                                    <Row style={{ marginBottom: 20 }}>
                                        <Button text='Log out' color='blue' onClick={logOut} />
                                    </Row>
                                    <Column className={styles.accountMenuTabs}>
                                        <Link
                                            to={`/u/${accountData.handle}/about`}
                                            onClick={() => toggleAccountMenu()}
                                        >
                                            <AboutIcon />
                                            <p>About</p>
                                        </Link>
                                        <Link
                                            to={`/u/${accountData.handle}/posts`}
                                            onClick={() => toggleAccountMenu()}
                                        >
                                            <PostsIcon />
                                            <p>Posts</p>
                                        </Link>
                                        <Link
                                            to={`/u/${accountData.handle}/notifications`}
                                            onClick={() => toggleAccountMenu()}
                                        >
                                            <BellIcon />
                                            <p>Notifications</p>
                                        </Link>
                                        <Link
                                            to={`/u/${accountData.handle}/settings`}
                                            onClick={() => toggleAccountMenu()}
                                        >
                                            <SettingsIcon />
                                            <p>Settings</p>
                                        </Link>
                                    </Column>
                                    <p className='grey'>Followed spaces</p>
                                    <Scrollbars style={{ marginTop: 10 }}>
                                        <Column>
                                            {accountData.FollowedHolons.map((space) => (
                                                <ImageTitle
                                                    key={space.id}
                                                    type='space'
                                                    imagePath={space.flagImagePath}
                                                    imageSize={35}
                                                    title={space.name}
                                                    fontSize={14}
                                                    link={`/s/${space.handle}/${selectedSpaceSubPage}`}
                                                    style={{ marginBottom: 10 }}
                                                    onClick={() => toggleAccountMenu()}
                                                />
                                            ))}
                                        </Column>
                                    </Scrollbars>
                                </Column>
                            </>
                        )}
                    </Row>
                    <Row centerY className={styles.desktopRight}>
                        <div
                            className={styles.profileButton}
                            onMouseEnter={() => setProfileDropDownOpen(true)}
                            onMouseLeave={() => setProfileDropDownOpen(false)}
                        >
                            <p>{accountData.name}</p>
                            <FlagImage
                                type='user'
                                size={40}
                                imagePath={accountData.flagImagePath}
                            />
                            {accountData.unseenNotifications > 0 && (
                                <div className={styles.totalUnseenItems}>
                                    <p>{accountData.unseenNotifications}</p>
                                </div>
                            )}
                            {profileDropDownOpen && (
                                <div className={styles.profileDropDown}>
                                    <Link to={`/u/${accountData.handle}/about`}>
                                        <UserIcon />
                                        <p>Profile</p>
                                    </Link>
                                    <Link to={`/u/${accountData.handle}/posts`}>
                                        <PostsIcon />
                                        <p>Posts</p>
                                    </Link>
                                    <Link to={`/u/${accountData.handle}/notifications`}>
                                        <BellIcon />
                                        <p>Notifications</p>
                                        {accountData.unseenNotifications > 0 && (
                                            <div className={styles.unseenItems}>
                                                <p>{accountData.unseenNotifications}</p>
                                            </div>
                                        )}
                                    </Link>
                                    <Link to={`/u/${accountData.handle}/settings`}>
                                        <SettingsIcon />
                                        <p>Settings</p>
                                    </Link>
                                    <Row centerX style={{ marginTop: 15 }}>
                                        <Button text='Log out' color='blue' onClick={logOut} />
                                    </Row>
                                </div>
                            )}
                        </div>
                    </Row>
                </>
            ) : (
                <Row centerY style={{ marginRight: 10 }}>
                    <Button text='Log in' color='blue' onClick={() => setLogInModalOpen(true)} />
                    {/* <Button text='Donate' color='purple' onClick={() => setDonateModalOpen(true)} /> */}
                </Row>
            )}
        </Row>
    )
}

export default Navbar
