import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/pages/SpacePage/SpacePageFilters.module.scss'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const SpacePagePostsFilters = (props: {
    params: any
    applyParam: (param: string, value: string) => void
}): JSX.Element => {
    const { params, applyParam } = props
    const { spacePostsFilters } = useContext(SpaceContext)
    const { view } = spacePostsFilters
    return (
        <Row className={styles.wrapper}>
            <DropDownMenu
                title='Type'
                options={[
                    'All Types',
                    'Text',
                    'Image',
                    'Url',
                    'Audio',
                    'Event',
                    'Glass Bead Game',
                    'String',
                    'Prism',
                ]}
                selectedOption={params.type}
                setSelectedOption={(payload) => applyParam('type', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size By' : 'Sort By'}
                options={['Likes', 'Comments', 'Reposts', 'Ratings', 'Date']}
                selectedOption={params.sortBy}
                setSelectedOption={(payload) => applyParam('sortBy', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size Order' : 'Order'}
                options={['Descending', 'Ascending']}
                selectedOption={params.sortOrder}
                setSelectedOption={(payload) => applyParam('sortOrder', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Time Range'
                options={[
                    'All Time',
                    'Last Year',
                    'Last Month',
                    'Last Week',
                    'Last 24 Hours',
                    'Last Hour',
                ]}
                selectedOption={params.timeRange}
                setSelectedOption={(payload) => applyParam('timeRange', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Posts', 'Only Direct Posts']}
                selectedOption={params.depth}
                setSelectedOption={(payload) => applyParam('depth', payload)}
            />
        </Row>
    )
}

export default SpacePagePostsFilters
