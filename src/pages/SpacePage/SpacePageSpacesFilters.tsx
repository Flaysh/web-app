import React from 'react'
import styles from '@styles/pages/SpacePage/SpacePageFilters.module.scss'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const SpacePageSpacesFilters = (props: {
    params: any
    applyParam: (param: string, value: string) => void
}): JSX.Element => {
    const { params, applyParam } = props
    return (
        <Row className={styles.wrapper}>
            <DropDownMenu
                title='Sort By'
                options={[
                    'Followers',
                    'Posts',
                    'Comments',
                    'Date',
                    'Reactions',
                    'Likes',
                    'Ratings',
                ]}
                selectedOption={params.sortBy}
                setSelectedOption={(value) => applyParam('sortBy', value)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={params.sortOrder}
                setSelectedOption={(value) => applyParam('sortOrder', value)}
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
                setSelectedOption={(value) => applyParam('timeRange', value)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={params.depth}
                setSelectedOption={(value) => applyParam('depth', value)}
                style={{ marginRight: 10 }}
            />
        </Row>
    )
}

export default SpacePageSpacesFilters
