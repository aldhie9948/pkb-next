import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { AiFillCaretDown, AiFillEdit } from 'react-icons/ai';
import { FaCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import wilayahServices from '../../services/wilayah';
import { useDispatch, useSelector } from 'react-redux';
import {
  appendDemografi,
  getDemografiByProvincy,
  updateDemografi,
} from '../../reducers/demografiReducer';
import { IoSearchCircle } from 'react-icons/io5';
import sweetalert2 from '../../components/Alert';

const Demografi = () => {
  const [provinsi, setProvinsi] = useState(null);
  const [kabupaten, setKabupaten] = useState(null);
  const [filteredDistrict, setFilteredDistrict] = useState(null);
  const [searchDistrict, setSearchDistrict] = useState(null);
  const demografi = useSelector((state) => state.demografi);
  const dispatch = useDispatch();

  useEffect(() => {
    // kode provinsi jawa barat '32'
    wilayahServices.getDemografi('JAWA BARAT').then((res) => {
      setProvinsi(res);
    });

    dispatch(getDemografiByProvincy(32));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulldownAccordionHandler = (e) => {
    e.currentTarget.nextSibling.classList.toggle('hidden');
  };

  const isVillageNotEmpty = (idVillage) => {
    const array = demografi.filter((f) => f.idVillage === idVillage);
    return array.length === 0 ? null : array;
  };

  const switchHandler = (idVillage) => {
    const village = isVillageNotEmpty(idVillage);
    if (village) return updateHandler;
    return saveHandler;
  };

  const saveHandler = async (e) => {
    const target = e.currentTarget;
    const inputValue = Number(target.previousSibling.value);
    const idProvincy = Number(target.dataset.idProvincy);
    const idRegency = Number(target.dataset.idRegency);
    const idDistrict = Number(target.dataset.idDistrict);
    const idVillage = Number(target.dataset.idVillage);

    if (inputValue <= 0)
      return sweetalert2.toast('Angka harus lebih dari nol', false);

    const add = {
      idProvincy,
      idRegency,
      idDistrict,
      idVillage,
      total: inputValue,
    };

    try {
      sweetalert2.confirm(() => {
        dispatch(appendDemografi(add));
        target.previousSibling.value = null;
        sweetalert2.toast('Proses berhasil!');
      });
    } catch (error) {
      console.log(error);
      sweetalert2.toast(error.message.toString(), false);
    }
  };

  const updateHandler = async (e) => {
    console.log(e);
    const target = e.currentTarget;
    const inputValue = Number(target.previousSibling.value);
    const idProvincy = Number(target.dataset.idProvincy);
    const idRegency = Number(target.dataset.idRegency);
    const idDistrict = Number(target.dataset.idDistrict);
    const idVillage = Number(target.dataset.idVillage);
    if (inputValue <= 0)
      return sweetalert2.toast('Angka harus lebih dari nol', false);

    const update = {
      idProvincy,
      idRegency,
      idDistrict,
      idVillage,
      total: inputValue,
    };
    try {
      sweetalert2.confirm(() => {
        dispatch(updateDemografi(idVillage, update));
        target.previousSibling.value = null;
        sweetalert2.toast('Proses berhasil!');
      });
    } catch (error) {
      console.log(error);
      sweetalert2.toast(error.message.toString(), false);
    }
  };

  const getDemografiTotal = (idVillage) => {
    const village = demografi.find((d) => d.idVillage === Number(idVillage));
    return village && village.total;
  };

  const searchHandler = (e) => {
    const value = e.currentTarget.value;
    setSearchDistrict(value);
    if (value === '') return setFilteredDistrict(kabupaten);

    return setFilteredDistrict((current) => {
      const district = current.districts.filter((f) =>
        f.name.toLowerCase().includes(value.toLowerCase())
      );
      return { ...current, districts: district };
    });
  };

  return (
    <Layout title={`Demografi`}>
      <h1 className='text-lg font-bold'>Demografi Penduduk Jawa Barat 2022</h1>
      <div className='flex flex-wrap sm:justify-between gap-2 mb-4'>
        <Select
          id='kabupaten-select'
          instanceId='kabupaten-select'
          className='sm:w-4/12 w-full my-auto shadow'
          options={
            provinsi &&
            provinsi.regencies.map((d) => {
              return { label: d.name, value: d.id };
            })
          }
          onChange={(e) => {
            const kab = provinsi.regencies.filter((f) => f.id === e.value)[0];
            setKabupaten(kab);
            setFilteredDistrict(kab);
            setSearchDistrict('');
          }}
        />
        {kabupaten && (
          <div className='flex gap-2 p-2 sm:p-1 bg-green-500 rounded shadow sm:w-4/12 w-full'>
            <IoSearchCircle className='my-auto text-white mx-5' size='1.5em' />
            <input
              onChange={searchHandler}
              value={searchDistrict}
              type='search'
              placeholder='cari kecamatan..'
              className='px-2 text-sm bg-white rounded outline-none flex-grow placeholder:italic placeholder:capitalize placeholder:text-sm py-1 sm:py-0'
            />
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {filteredDistrict &&
          filteredDistrict.districts.map((district) => (
            <div
              key={district.id}
              className='accordion break-inside-avoid-column'
            >
              <div className='p-4 bg-white rounded shadow'>
                <div
                  onClick={pulldownAccordionHandler}
                  className='accordion-header flex justify-between cursor-pointer'
                >
                  <div className='title flex gap-4'>
                    <AiFillCaretDown className='my-auto' />{' '}
                    <div className='font-bold'>
                      Kecamatan {district.name}{' '}
                      <small className='bg-blue-400 py-[2px] px-3 rounded-xl shadow text-white text-xs'>
                        {demografi.filter(
                          (f) => f.idDistrict === district.id
                        ) &&
                          demografi
                            .filter((f) => f.idDistrict === district.id)
                            .reduce((acc, obj) => acc + obj.total, 0)
                            .toLocaleString()}
                      </small>
                    </div>
                  </div>
                  <div className='icons flex gap-2'>
                    <small className='block my-auto'>
                      {
                        demografi.filter((f) => f.idDistrict === district.id)
                          .length
                      }
                      /{district.villages.length}
                    </small>
                    {demografi.filter((f) => f.idDistrict === district.id)
                      .length === district.villages.length ? (
                      <FaCheckCircle className='my-auto text-green-500' />
                    ) : (
                      <FaTimesCircle className='my-auto text-red-500' />
                    )}
                  </div>
                </div>
                <div className='accordion-body my-4 hidden px-5'>
                  {district.villages.map((village) => (
                    <div key={village.id} className='grid grid-cols-6 my-1'>
                      <small className='block my-auto w-6/12 whitespace-nowrap col-span-3'>
                        {village.name}
                      </small>
                      <div className='col-span-3 grid grid-cols-5 gap-2'>
                        <input
                          placeholder={getDemografiTotal(village.id)}
                          type='number'
                          className='block my-auto outline-none py-1 px-2 border-[1px] border-slate-400 rounded box-border col-span-4'
                        />
                        <button
                          data-id-provincy={provinsi.id}
                          data-id-regency={kabupaten.id}
                          data-id-district={district.id}
                          data-id-village={village.id}
                          onClick={switchHandler(village.id)}
                          type='button'
                          className={`block bg-blue-500 text-white rounded shadow px-2 col-span-1 hover:opacity-60 disabled:opacity-80 ${
                            isVillageNotEmpty(village.id)
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                          title={
                            isVillageNotEmpty(village.id) ? 'Update' : 'Simpan'
                          }
                        >
                          {isVillageNotEmpty(village.id) ? (
                            <AiFillEdit className='mx-auto' />
                          ) : (
                            <FaCheck className='mx-auto' />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default Demografi;
