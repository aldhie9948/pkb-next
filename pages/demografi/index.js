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
import { IoSearchCircle, IoMan, IoWoman, IoStatsChart } from 'react-icons/io5';
import sweetalert2 from '../../components/Alert';
import { useField } from '../../hooks';

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

  const FormInput = ({ provincy, regency, district, village }) => {
    const pria = useField('number');
    const wanita = useField('number');
    const [isUpdate, setIsUpdate] = useState(false);

    const isVillageNotEmpty = (idVillage) => {
      const array = demografi.filter((f) => f.idVillage === idVillage);
      return array.length === 0 ? null : array;
    };

    const getDemografiTotal = (idVillage) => {
      const village = demografi.find((d) => d.idVillage === Number(idVillage));
      if (!village) return { total: 0, pria: 0, wanita: 0 };
      const {
        total,
        gender: { pria, wanita },
      } = village;
      return { total, pria, wanita };
    };

    const switchHandler = (idVillage) => {
      const village = isVillageNotEmpty(idVillage);
      if (village) return setIsUpdate(true);
      return setIsUpdate(false);
    };

    useEffect(() => {
      switchHandler(village.id);
      // eslint-disable-next-line
    }, []);

    const submitHandler = async () => {
      if (Number(pria.value) <= 0 || Number(wanita.value) <= 0)
        return sweetalert2.toast('Angka tidak boleh nol', false);
      const idProvincy = Number(provincy.id);
      const idRegency = Number(regency.id);
      const idDistrict = Number(district.id);
      const idVillage = Number(village.id);
      const gender = {
        pria: Number(pria.value),
        wanita: Number(wanita.value),
      };
      const total = Object.values(gender).reduce((a, b) => a + b, 0);
      const save = {
        idProvincy,
        idRegency,
        idDistrict,
        idVillage,
        gender,
        total,
      };

      try {
        sweetalert2.confirm(() => {
          const action = isUpdate
            ? updateDemografi(save)
            : appendDemografi(save);
          dispatch(action);
          pria.reset();
          wanita.reset();
          sweetalert2.toast('Proses berhasil!');
        });
      } catch (error) {
        console.log(error);
        sweetalert2.toast(error.message.toString(), false);
      }
    };

    return (
      <div>
        <div className='flex gap-2 justify-end my-1'>
          <small className='block my-auto text-ellipsis overflow-hidden whitespace-nowrap sm:flex-grow sm:w-4/12 w-5/12'>
            {village.name}
          </small>
          <div className='flex gap-2'>
            <div className='flex gap-1 border rounded bg-slate-100'>
              <IoMan className='my-auto' />
              <input
                {...pria.attr}
                placeholder={getDemografiTotal(
                  village.id
                ).pria.toLocaleString()}
                type='number'
                className='block pl-1 w-16 sm:w-24 outline-none caret-green-500'
              />
            </div>
            <div className='flex gap-1 border rounded bg-slate-100'>
              <IoWoman className='my-auto' />
              <input
                {...wanita.attr}
                placeholder={getDemografiTotal(
                  village.id
                ).wanita.toLocaleString()}
                type='number'
                className='block pl-1 w-16 sm:w-24 outline-none caret-green-500'
              />
            </div>
          </div>
          <button
            type='button'
            onClick={submitHandler}
            className={`flex gap-1 text-xs rounded shadow w-20 px-2 sm:col-span-1 col-span-2 hover:opacity-60 disabled:opacity-80 ${
              isVillageNotEmpty(village.id)
                ? 'bg-red-200 text-red-500'
                : 'bg-blue-200 text-blue-500'
            }`}
            title={isVillageNotEmpty(village.id) ? 'Update' : 'Simpan'}
          >
            {isVillageNotEmpty(village.id) ? (
              <AiFillEdit className='my-auto' />
            ) : (
              <FaCheck className='my-auto' />
            )}
            <div className='my-auto'>
              {getDemografiTotal(village.id).total.toLocaleString()}
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout title={`Demografi`}>
      <h1 className='sm:text-lg font-bold'>
        Demografi Penduduk Jawa Barat 2022
      </h1>
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
                    <div className='font-bold sm:text-lg text-sm'>
                      Kec. {district.name}{' '}
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
                <div className='accordion-body my-4 hidden sm:px-5'>
                  {district.villages.map((village) => (
                    <FormInput
                      key={village.id}
                      provincy={provinsi}
                      regency={kabupaten}
                      district={district}
                      village={village}
                    />
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
