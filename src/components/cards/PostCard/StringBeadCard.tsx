/* eslint-disable react/no-array-index-key */
import AudioTimeSlider from '@components/AudioTimeSlider'
import AudioVisualiser from '@components/AudioVisualiser'
import BeadCardUrlPreview from '@components/cards/BeadCardUrlPreview'
import PostCardLikeModal from '@components/cards/PostCard/PostCardLikeModal'
import PostCardLinkModal from '@components/cards/PostCard/PostCardLinkModal'
import CloseButton from '@components/CloseButton'
import Column from '@components/Column'
import DraftText from '@components/draft-js/DraftText'
import ImageTitle from '@components/ImageTitle'
import ImageModal from '@components/modals/ImageModal'
import Row from '@components/Row'
import Scrollbars from '@components/Scrollbars'
import StatButton from '@components/StatButton'
import { AccountContext } from '@contexts/AccountContext'
import { handleImageError, statTitle } from '@src/Helpers'
import colors from '@styles/Colors.module.scss'
import styles from '@styles/components/cards/PostCard/StringBeadCard.module.scss'
import { ReactComponent as CommentIcon } from '@svgs/comment-solid.svg'
import { ReactComponent as TextIcon } from '@svgs/font-solid.svg'
import { ReactComponent as ImageIcon } from '@svgs/image-solid.svg'
import { ReactComponent as LikeIcon } from '@svgs/like.svg'
import { ReactComponent as LinkIcon } from '@svgs/link-solid.svg'
import { ReactComponent as PauseIcon } from '@svgs/pause-solid.svg'
import { ReactComponent as PlayIcon } from '@svgs/play-solid.svg'
import { ReactComponent as SourceIcon } from '@svgs/right-to-bracket-solid.svg'
import { ReactComponent as AudioIcon } from '@svgs/volume-high-solid.svg'
import * as d3 from 'd3'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const StringBeadCard = (props: {
    bead: any
    postId?: number
    postType?: string
    beadIndex: number
    location:
        | 'preview'
        | 'create-string-modal'
        | 'next-bead-modal'
        | 'post-page'
        | 'space-posts'
        | 'space-post-map'
        | 'user-posts'
    selected?: boolean
    toggleBeadComments?: () => void
    removeBead?: (beadIndex: number) => void
    style?: any
}): JSX.Element => {
    const {
        bead: sourceBeadData,
        postId,
        postType,
        beadIndex,
        location,
        selected,
        toggleBeadComments,
        removeBead,
        style,
    } = props
    const { accountData } = useContext(AccountContext)
    const [bead, setBead] = useState(sourceBeadData)
    const { totalLikes, totalComments, totalLinks, accountLike, accountComment, accountLink } = bead
    const [audioPlaying, setAudioPlaying] = useState(false)
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [likeModalOpen, setLikeModalOpen] = useState(false)
    const [linkModalOpen, setLinkModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<any>(null)
    const images = bead.PostImages ? bead.PostImages.sort((a, b) => a.index - b.index) : []
    const type = bead.type.replace('string-', '')
    const isSource = bead.Link && bead.Link.relationship === 'source'
    const showFooter =
        !['create-string-modal', 'next-bead-modal'].includes(location) &&
        postType !== 'glass-bead-game'
    const history = useHistory()

    function findBeadIcon(beadType) {
        switch (beadType) {
            case 'text':
                return <TextIcon />
            case 'url':
                return <LinkIcon />
            case 'audio':
                return <AudioIcon />
            case 'image':
                return <ImageIcon />
            default:
                return null
        }
    }

    function toggleBeadAudio(index: number, reset?: boolean): void {
        const beadAudio = d3.select(`#string-bead-audio-${postId}-${index}-${location}`).node()
        if (beadAudio) {
            if (!beadAudio.paused) beadAudio.pause()
            else {
                // pause all playing audio
                d3.selectAll('audio')
                    .nodes()
                    .forEach((node) => node.pause())
                // start selected bead
                if (reset) beadAudio.currentTime = 0
                beadAudio.play()
            }
        }
    }

    function openImageModal(imageId) {
        setSelectedImage(images.find((image) => image.id === imageId))
        setImageModalOpen(true)
    }

    useEffect(() => setBead(sourceBeadData), [sourceBeadData])

    return (
        <Column
            spaceBetween
            className={`${styles.wrapper} ${selected && styles.selected} ${
                isSource && styles.source
            }`}
            style={{ ...style, backgroundColor: bead.color }}
        >
            {/* <div className={styles.watermark} /> */}
            <Row spaceBetween className={styles.beadHeader}>
                {postType && ['glass-bead-game', 'weave'].includes(postType) && (
                    <ImageTitle
                        type='user'
                        imagePath={bead.Creator.flagImagePath}
                        title={bead.Creator.id === accountData.id ? 'You' : bead.Creator.name}
                        fontSize={12}
                        imageSize={20}
                        style={{ marginRight: 10 }}
                    />
                )}
                <div className={styles.beadType}>{findBeadIcon(type)}</div>
                {removeBead && bead.Link.relationship !== 'source' && (
                    <CloseButton size={20} onClick={() => removeBead(beadIndex)} />
                )}
                {bead.Link.relationship === 'source' && (
                    <button
                        type='button'
                        title='Open source bead'
                        className={styles.beadRelationship}
                        onClick={() =>
                            !['create-string-modal', 'next-bead-modal', 'preview'].includes(
                                location
                            ) && history.push(`/p/${bead.id}`)
                        }
                    >
                        <SourceIcon />
                    </button>
                )}
            </Row>
            <Column centerY className={styles.beadContent}>
                {type === 'text' && (
                    <Scrollbars>
                        <DraftText stringifiedDraft={bead.text} />
                    </Scrollbars>
                )}
                {type === 'url' && (
                    <Scrollbars>
                        <BeadCardUrlPreview
                            url={bead.url}
                            image={bead.urlImage}
                            domain={bead.urlDomain}
                            title={bead.urlTitle}
                            description={bead.urlDescription}
                        />
                    </Scrollbars>
                )}
                {type === 'audio' && (
                    <Column key={beadIndex} spaceBetween style={{ height: '100%' }}>
                        <AudioVisualiser
                            audioElementId={`string-bead-audio-${postId}-${beadIndex}-${location}`}
                            audioURL={bead.url}
                            staticBars={400}
                            staticColor={colors.audioVisualiserColor}
                            dynamicBars={60}
                            dynamicColor={colors.audioVisualiserColor}
                            style={{
                                width: '100%',
                                height: 100,
                                marginTop: showFooter ? 10 : 20,
                            }}
                        />
                        <Row centerY>
                            <button
                                className={styles.playButton}
                                type='button'
                                onClick={() => toggleBeadAudio(beadIndex)}
                            >
                                {audioPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <AudioTimeSlider
                                audioElementId={`string-bead-audio-${postId}-${beadIndex}-${location}`}
                                audioURL={bead.url}
                                location='space-posts'
                                onPlay={() => setAudioPlaying(true)}
                                onPause={() => setAudioPlaying(false)}
                                onEnded={() => toggleBeadAudio(beadIndex + 1, true)}
                            />
                        </Row>
                    </Column>
                )}
                {type === 'image' && (
                    <Row centerX>
                        <Scrollbars style={{ paddingBottom: 5 }} className='row'>
                            {images.map((image, i) => (
                                <button
                                    className={styles.image}
                                    key={i}
                                    type='button'
                                    onClick={() => openImageModal(image.id)}
                                >
                                    <img
                                        src={image.url}
                                        onError={(e) => handleImageError(e, image.url)}
                                        alt=''
                                    />
                                </button>
                            ))}
                        </Scrollbars>
                    </Row>
                )}
            </Column>
            {showFooter && (
                <Row spaceBetween className={styles.beadFooter}>
                    <StatButton
                        icon={<LikeIcon />}
                        iconSize={20}
                        text={totalLikes || ''}
                        title={statTitle('Like', totalLikes || 0)}
                        color={accountLike && 'blue'}
                        disabled={location === 'preview'}
                        onClick={() => setLikeModalOpen(true)}
                    />
                    <StatButton
                        icon={<CommentIcon />}
                        iconSize={20}
                        text={totalComments || ''}
                        title={statTitle('Comment', totalComments || 0)}
                        // color={accountComment && 'blue'}
                        disabled={location === 'preview'}
                        onClick={() => toggleBeadComments && toggleBeadComments()}
                    />
                    <StatButton
                        icon={<LinkIcon />}
                        iconSize={20}
                        text={totalLinks || ''}
                        title={statTitle('Link', totalLinks || 0)}
                        color={accountLink && 'blue'}
                        disabled={location === 'preview'}
                        onClick={() => setLinkModalOpen(true)}
                    />
                    {likeModalOpen && (
                        <PostCardLikeModal
                            close={() => setLikeModalOpen(false)}
                            postData={bead}
                            setPostData={setBead}
                        />
                    )}
                    {linkModalOpen && (
                        <PostCardLinkModal
                            type='bead'
                            location={location}
                            postId={postId}
                            postData={bead}
                            setPostData={setBead}
                            close={() => setLinkModalOpen(false)}
                        />
                    )}
                </Row>
            )}
            {imageModalOpen && (
                <ImageModal
                    images={images}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    close={() => setImageModalOpen(false)}
                />
            )}
        </Column>
    )
}

StringBeadCard.defaultProps = {
    postId: null,
    postType: null,
    selected: false,
    toggleBeadComments: null,
    removeBead: null,
    style: null,
}

export default StringBeadCard
