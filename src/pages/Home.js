import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/InputSearch";
import { CardList } from "../components/CardList/CardList";
import { useForm } from "react-hook-form";
import { Api } from "../service/api";
import { PATH_API } from "../service/globalSettings";
import { SortBy } from "../components/sortBy/SortBy";
import { Modal } from '../components/Modal/Modal';
import ReactLoading from 'react-loading';
import { Paginations } from '../components/Pagination/Pagination';


export const Home = () => {
  const [input, setInput] = useState('');
  const val = useRef();
  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
  } = useForm({ defaultValues: { inputSearch: input } });
  const [character, setCharacter] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [characterActive, setCharacterActive] = useState();
  const [loading, setLoading] = useState(false);
  const [numOfPage, setNumOfPage] = useState();

  useEffect(() => {
    const inputSearch = localStorage.getItem('inputSearch');
    setInput(inputSearch);
    onInit();
  }, [Home]);

  useEffect(() => {
    val.current = input;
  }, [input]);

  useEffect(() => {
    return () => {
      localStorage.setItem('inputSearch', val.current);
    }
  }, []);

  const inputChange = (e) => {
    setInput(e);
  };

  const onInit = async () => {
    try {
      const res = await Api.get(PATH_API);
      setNumOfPage(res.info.pages);
      setCharacter(res.results);
      setTimeout(() => {
        setLoading(true);
      }, 500);
    } catch(e) {
      console.error(e);
    }
  }

  const onSubmit = async (data) => {
    try {
      const res = await Api.get(`${PATH_API}/?name=${data.inputSearch}`);
      setCharacter(res.results);
      setTimeout(() => {
        setLoading(true);
      }, 500);
    } catch (e) {
      console.error(e);
    }
  }

  const onSortStatus = (data) => {
    setCharacter(data);
  }

  return (
    <div>
      <div style={searchBlock}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            input={input}
            register={register}
            errors={errors}
            inputChange={inputChange}
            placeholder="Search..."
          />
          <Button variant="contained" title="search" />
        </form>
      </div>
      <SortBy onSortStatus={onSortStatus} input={input} />
      {
        loading
          ? <>
              <CardList
                characters={character}
                setActive={setModalActive}
                characterActive={setCharacterActive}
              />
              <Paginations setCharacter={setCharacter} numOfPage={numOfPage} />
            </>
          : <div style={spin}>
              <ReactLoading
                type={'spin'}
                height={'3%'}
                width={'3%'}
              />
            </div>
      }
      { modalActive
        ? <Modal
            active={modalActive}
            setActive={setModalActive}
            characterActive={characterActive}
          />
        : null
      } 
    </div>
  ); 
};

const searchBlock = {
  display: 'flex',
  maxWidth: '67%',
  margin: '0 auto',
};

const spin = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: '0',
  display:' flex',
  justifyContent: 'center',
  alignItems: 'center',
};