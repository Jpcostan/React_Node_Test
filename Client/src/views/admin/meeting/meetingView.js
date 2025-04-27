import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { DrawerFooter, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import Spinner from "components/spinner/Spinner";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BiLink } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { getApi } from 'services/api';
import { HasAccess } from "../../../redux/accessUtils";

const MeetingView = ({ onClose, isOpen, info, fetchData, setAction, action, access }) => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [deleteModel, setDelete] = useState(false);
    const navigate = useNavigate();

    const [contactAccess, leadAccess] = HasAccess(['Contacts', 'Leads']);

    const fetchViewData = async () => {
        if (info) {
            setIsLoading(true);
            const result = await getApi('/api/meeting/view/', info?.event ? info?.event?.id : info);
            if (result?.data?.success) {
                setData(result.data.data);
            } else {
                setData({});
            }
            setIsLoading(false);
        }
    };    

    useEffect(() => {
        fetchViewData();
    }, [action, info]);

    const handleViewOpen = () => {
        const id = info?.event ? info?.event?.id : info;
        navigate(`/view/${id}`);
    };

    return (
        <Modal isOpen={isOpen} size={'md'} isCentered>
            <ModalOverlay />
            <ModalContent height="70%">
                <ModalHeader justifyContent="space-between" display="flex">
                    Meeting
                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>

                {isLoading ? (
                    <Flex justifyContent="center" alignItems="center" mb={30} width="100%">
                        <Spinner />
                    </Flex>
                ) : (
                    <>
                        <ModalBody overflowY="auto">
                            <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Agenda</Text>
                                    <Text>{data?.agenda || '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Date & Time</Text>
                                    <Text>{data?.dateTime ? moment(data.dateTime).format('lll') : '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Created By</Text>
                                    <Text>{data?.createdByName || '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Related</Text>
                                    <Text>{data?.related || '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Location</Text>
                                    <Text>{data?.location || '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12, md: 6 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Notes</Text>
                                    <Text>{data?.notes || '-'}</Text>
                                </GridItem>

                                <GridItem colSpan={{ base: 12 }}>
                                    <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">Attendees</Text>
                                    {data?.related === 'Contact' && contactAccess?.view ? (
                                        data?.attendes?.map(item => (
                                            <Link key={item._id} to={`/contactView/${item._id}`}>
                                                <Text color="brand.600" _hover={{ color: 'blue.500', textDecoration: 'underline' }}>
                                                    {item.firstName} {item.lastName}
                                                </Text>
                                            </Link>
                                        ))
                                    ) : data?.related === 'Lead' && leadAccess?.view ? (
                                        data?.attendesLead?.map(item => (
                                            <Link key={item._id} to={`/leadView/${item._id}`}>
                                                <Text color="brand.600" _hover={{ color: 'blue.500', textDecoration: 'underline' }}>
                                                    {item.leadName}
                                                </Text>
                                            </Link>
                                        ))
                                    ) : data?.related === 'Contact' ? (
                                        data?.attendes?.map(item => (
                                            <Text key={item._id} color="blackAlpha.900">{item.firstName} {item.lastName}</Text>
                                        ))
                                    ) : data?.related === 'Lead' ? (
                                        data?.attendesLead?.map(item => (
                                            <Text key={item._id} color="blackAlpha.900">{item.leadName}</Text>
                                        ))
                                    ) : (
                                        <Text>-</Text>
                                    )}
                                </GridItem>
                            </Grid>
                        </ModalBody>

                        <DrawerFooter>
                            {access?.view && (
                                <IconButton variant="outline" colorScheme="green" onClick={handleViewOpen} borderRadius="10px" size="md" icon={<ViewIcon />} />
                            )}
                            {access?.update && (
                                <IconButton variant="outline" onClick={() => setEdit(true)} ml={3} borderRadius="10px" size="md" icon={<EditIcon />} />
                            )}
                            {access?.delete && (
                                <IconButton colorScheme="red" onClick={() => setDelete(true)} ml={3} borderRadius="10px" size="md" icon={<DeleteIcon />} />
                            )}
                        </DrawerFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default MeetingView;
