import { CloseIcon } from '@chakra-ui/icons'
import { Box, flexbox } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction}) => {
    return (
        <Box
            paddingX={2}
            paddingY={1}
            borderRadius="lg"
            margin={1}
            marginBottom={2}
            variant="solid"
            fontSize="13px"
            backgroundColor="purple"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {user.name}
            <CloseIcon 
                boxSize="16px" 
                cursor="pointer" 
                onClick={handleFunction} 
                paddingLeft={2} />
        </Box>
    )

}

export default UserBadgeItem
