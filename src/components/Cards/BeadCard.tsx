import React, { useContext, useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import styles from '@styles/components/cards/BeadCard.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import ImageTitle from '@components/ImageTitle'
import Column from '@src/components/Column'
import Row from '@src/components/Row'
import { ReactComponent as PlayIconSVG } from '@svgs/play-solid.svg'
import { ReactComponent as PauseIconSVG } from '@svgs/pause-solid.svg'

const BeadCard = (props: {
    postId: number
    index: number
    bead: any
    style?: any
}): JSX.Element => {
    const { postId, index, bead, style } = props
    const { accountData } = useContext(AccountContext)
    const [audioPlaying, setAudioPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    function toggleBeadAudio(beadIndex: number, reset?: boolean): void {
        const audio = d3.select(`#gbg-bead-${postId}-${beadIndex}`).select('audio').node()
        if (audio) {
            if (audio.paused) {
                // stop all playing beads
                const allBeads = document.getElementsByClassName('gbg-bead')
                for (let i = 0; i < allBeads.length; i += 1) {
                    const beadAudio = allBeads[i].getElementsByTagName(
                        'audio'
                    )[0] as HTMLAudioElement
                    beadAudio.pause()
                }
                // start selected bead
                if (reset) audio.currentTime = 0
                audio.play()
            } else {
                // pause bead
                audio.pause()
            }
        }
    }

    useEffect(() => {
        if (audioRef && audioRef.current) {
            audioRef.current.src = bead.beadUrl
            audioRef.current.addEventListener('play', () => setAudioPlaying(true))
            audioRef.current.addEventListener('pause', () => setAudioPlaying(false))
            audioRef.current.addEventListener('ended', () => toggleBeadAudio(index + 1, true))
        }
    }, [])

    return (
        <Column
            spaceBetween
            id={`gbg-bead-${postId}-${index}`}
            className={`gbg-bead ${styles.bead} ${audioPlaying && styles.focused}`}
            style={style}
        >
            <ImageTitle
                type='user'
                imagePath={bead.user.flagImagePath}
                title={bead.user.id === accountData.id ? 'You' : bead.user.name}
                fontSize={12}
                imageSize={20}
                style={{ marginRight: 10 }}
            />
            <img src='/icons/gbg/sound-wave.png' alt='sound-wave' />
            <Row className={styles.controls}>
                <button
                    className={styles.playButton}
                    type='button'
                    aria-label='toggle-audio'
                    onClick={() => toggleBeadAudio(index)}
                >
                    {audioPlaying ? <PauseIconSVG /> : <PlayIconSVG />}
                </button>
            </Row>
            <audio ref={audioRef}>
                <track kind='captions' />
            </audio>
        </Column>
    )
}

BeadCard.defaultProps = {
    style: null,
}

export default BeadCard
