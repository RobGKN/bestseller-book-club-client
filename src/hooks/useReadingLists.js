import { useContext } from 'react';
import { ReadingListContext } from '../context/ReadingListContext';

export const useReadingLists = () => useContext(ReadingListContext);
