import { useEffect, useState } from 'react';
import { DeleteIcon, ViewIcon, SearchIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import { HasAccess } from '../../../redux/accessUtils';
import CommonCheckTable from '../../../components/reactTable/checktable';
import { CiMenuKebab } from 'react-icons/ci';
import MeetingAdvanceSearch from './components/MeetingAdvanceSearch';
import AddMeeting from './components/Addmeeting';
import CommonDeleteModel from 'components/commonDeleteModel';
import MeetingView from './meetingView';
import { deleteManyApi } from 'services/api';
import { toast } from 'react-toastify';
import { fetchMeetingData } from '../../../redux/slices/meetingSlice';
import { useDispatch } from 'react-redux';

const Index = () => {
    const title = "Meeting";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
    const [searchboxOutside, setSearchboxOutside] = useState('');
    const [deleteMany, setDeleteMany] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [displaySearchData, setDisplaySearchData] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [action, setAction] = useState(false);
    const [permission] = HasAccess(['Meetings']);
    const dispatch = useDispatch();

    const actionHeader = {
        Header: "Action",
        isSortable: false,
        center: true,
        cell: ({ row }) => (
            <Text fontSize="md" fontWeight="900" textAlign="center">
                <Menu isLazy>
                    <MenuButton><CiMenuKebab /></MenuButton>
                    <MenuList minW="fit-content">
                        {permission?.view && (
                            <MenuItem
                                py={2.5}
                                color="green"
                                onClick={() => {
                                    setSelectedMeetingId(row?.values._id);
                                    setViewOpen(true);
                                }}
                                icon={<ViewIcon fontSize={15} />}
                            >
                                View
                            </MenuItem>
                        )}
                        {permission?.delete && (
                            <MenuItem
                                py={2.5}
                                color="red"
                                onClick={() => {
                                    setDeleteMany(true);
                                    setSelectedValues([row?.values._id]);
                                }}
                                icon={<DeleteIcon fontSize={15} />}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Text>
        )
    };

    const tableColumns = [
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
        {
            Header: 'Agenda',
            accessor: 'agenda',
            cell: ({ row }) => (
                <Text
                    me="10px"
                    sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
                    color="brand.600"
                    fontSize="sm"
                    fontWeight="700"
                    onClick={() => {
                        setSelectedMeetingId(row?.values._id);
                        setViewOpen(true);
                    }}
                >
                    {row?.values?.agenda || ' - '}
                </Text>
            )
        },
        { Header: "Date & Time", accessor: "dateTime" },
        { Header: "Time Stamp", accessor: "timestamp" },
        { Header: "Created By", accessor: "createdByName" },
        ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : [])
    ];    

    const fetchData = async () => {
        setIsLoading(true);
        const result = await dispatch(fetchMeetingData());
        if (result?.payload?.success) {
            setData(result.payload.data);
        } else {
            setData([]);
            toast.error("Failed to fetch data", "error");
        }
        setIsLoading(false);
    };

    const handleDeleteMeeting = async (ids) => {
        try {
            setIsLoading(true);
            const response = await deleteManyApi('/api/meeting/deleteMany', ids);
            if (response.status === 200) {
                setSelectedValues([]);
                setDeleteMany(false);
                setAction((prev) => !prev);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [action]);

    return (
        <div>
            <CommonCheckTable
                title={title}
                isLoading={isLoading}
                columnData={tableColumns}
                allData={data}
                tableData={data}
                searchDisplay={displaySearchData}
                setSearchDisplay={setDisplaySearchData}
                searchedDataOut={searchedData}
                setSearchedDataOut={setSearchedData}
                tableCustomFields={[]}
                access={permission}
                onOpen={onOpen}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                setDelete={setDeleteMany}
                AdvanceSearch={
                    <Button
                        variant="outline"
                        colorScheme="brand"
                        leftIcon={<SearchIcon />}
                        mt={{ sm: "5px", md: "0" }}
                        size="sm"
                        onClick={() => setAdvanceSearch(true)}
                    >
                        Advance Search
                    </Button>
                }
                getTagValuesOutSide={getTagValuesOutSide}
                searchboxOutside={searchboxOutside}
                setGetTagValuesOutside={setGetTagValuesOutside}
                setSearchboxOutside={setSearchboxOutside}
                handleSearchType="MeetingSearch"
            />

            <MeetingAdvanceSearch
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                setSearchedData={setSearchedData}
                setDisplaySearchData={setDisplaySearchData}
                allData={data}
                setAction={setAction}
                setGetTagValues={setGetTagValuesOutside}
                setSearchbox={setSearchboxOutside}
            />

            <AddMeeting
                setAction={setAction}
                fetchData={fetchData}
                isOpen={isOpen}
                onClose={onClose}
            />

            <CommonDeleteModel
                isOpen={deleteMany}
                onClose={() => setDeleteMany(false)}
                type="Meetings"
                handleDeleteData={handleDeleteMeeting}
                ids={selectedValues}
            />

            <MeetingView
                isOpen={viewOpen}
                onClose={() => setViewOpen(false)}
                info={selectedMeetingId}
                fetchData={fetchData}
                setAction={setAction}
                action={action}
                access={permission}
            />
        </div>
    );
};

export default Index;
