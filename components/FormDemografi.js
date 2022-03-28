import { useField } from '../hooks';
import {
  FcBusinessman,
  FcBusinesswoman,
  FcGraduationCap,
} from 'react-icons/fc';

const FormDemografi = () => {
  // Gender
  const genderPria = useField('number');
  const genderWanita = useField('number');
  // Pendidikan
  const pTbsPria = useField('number');
  const pTbsWanita = useField('number');
  const pBtsPria = useField('number');
  const pBtsWanita = useField('number');
  const pSDPria = useField('number');
  const pSDWanita = useField('number');
  const pSMPPria = useField('number');
  const pSMPWanita = useField('number');
  const pSMAPria = useField('number');
  const pSMAWanita = useField('number');
  const pDiplomaPria = useField('number');
  const pDiplomaWanita = useField('number');
  const pD3Pria = useField('number');
  const pD3Wanita = useField('number');
  const pS1Pria = useField('number');
  const pS1Wanita = useField('number');
  const pS2Pria = useField('number');
  const pS2Wanita = useField('number');
  const pS3Pria = useField('number');
  const pS3Wanita = useField('number');

  const HeaderForm = ({ icons = [], title }) => {
    return (
      <div className='header flex gap-1 '>
        <div className='grid place-content-center p-4'>
          <div>
            {icons.map((Icon, index) => (
              <Icon key={index} className='inline-block sm:text-4xl text-3xl' />
            ))}
          </div>
        </div>
        <div>
          <small className='block'>Berdasarkan</small>
          <h1 className='sm:text-4xl text-2xl font-bold'>{title}</h1>
        </div>
      </div>
    );
  };

  const pendidikanArrayForm = [
    {
      hooks: [pTbsPria, pTbsWanita],
      title: 'Tidak / Belum Sekolah',
    },
    {
      hooks: [pBtsPria, pBtsWanita],
      title: 'Belum Tamat SD',
    },
    {
      hooks: [pSDPria, pSDWanita],
      title: 'SD / Sederajat',
    },
    {
      hooks: [pSMPPria, pSMPWanita],
      title: 'SMP / Sederajat',
    },
    {
      hooks: [pSMAPria, pSMAWanita],
      title: 'SMA / Sederajat',
    },
    {
      hooks: [pSMAPria, pSMAWanita],
      title: 'SMA / Sederajat',
    },
    {
      hooks: [pDiplomaPria, pDiplomaWanita],
      title: 'Diploma / Sederajat',
    },
    {
      hooks: [pD3Pria, pD3Wanita],
      title: 'Diploma III',
    },
    {
      hooks: [pS1Pria, pS1Wanita],
      title: 'Strata I',
    },
    {
      hooks: [pS2Pria, pS2Wanita],
      title: 'Strata II',
    },
    {
      hooks: [pS3Pria, pS3Wanita],
      title: 'Strata III',
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className='my-2'>
      <div className='title w-full bg-green-500 p-2 rounded shadow my-2 text-white text-center'>
        <div>
          <small>Form Pengisian Demografi</small>
        </div>
        <h1 className='uppercase font-bold sm:text-3xl text-xl'>
          kabupaten bandung
        </h1>
      </div>
      {/* grid untuk tiap form indikator */}
      <form onSubmit={submitHandler}>
        <div className='form-demografi mx-auto lg:w-10/12 w-full'>
          {/* gender */}
          <div className='form-item'>
            <div className='bg-white shadow rounded sm:p-6 p-4'>
              <HeaderForm
                icons={[FcBusinessman, FcBusinesswoman]}
                title='Gender'
              />
              <hr />
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4'>
                <div className='my-auto'>Pria</div>
                <div className='col-span-3 p-1 flex border-[1px] border-slate-400 rounded-lg'>
                  <div className='icon grid place-content-center'>
                    <FcBusinessman size={`1.3em`} />
                  </div>
                  <div className='input w-full'>
                    <input
                      {...genderPria.attr}
                      placeholder='Masukkan jumlah angka..'
                      className='input-none py-1 px-2 placeholder:italic placeholder:text-sm'
                    />
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4'>
                <div className='my-auto'>Wanita</div>
                <div className='col-span-3 p-1 flex border-[1px] border-slate-400 rounded-lg'>
                  <div className='icon grid place-content-center'>
                    <FcBusinesswoman size={`1.3em`} />
                  </div>
                  <div className='input w-full'>
                    <input
                      {...genderWanita.attr}
                      placeholder='Masukkan jumlah angka..'
                      className='input-none py-1 px-2 placeholder:italic placeholder:text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pendidikan */}
          <div className='form-item'>
            <div className='bg-white shadow rounded sm:p-6 p-4'>
              <HeaderForm
                icons={[FcGraduationCap]}
                title='Tingkat Pendidikan'
              />
              <hr />
              {pendidikanArrayForm.map((arr, index) => (
                <div key={index} className='input-form mb-4'>
                  <div className='font-bold w-full'>
                    <div className='p-2 rounded bg-blue-200 border-l-8 border-blue-500 text-slate-500 sm:text-sm'>
                      {arr.title}
                    </div>
                  </div>
                  <div className='sm:col-span-2 flex flex-col gap-2 w-full'>
                    <div className='input-border flex-grow-0'>
                      <div className='icon grid place-content-center'>
                        <FcBusinessman size={`1.3em`} />
                      </div>
                      <div className='input w-full'>
                        <input
                          {...arr.hooks[0].attr}
                          placeholder='Masukkan jumlah angka..'
                          className='input-none py-1 px-2 placeholder:italic placeholder:text-sm'
                        />
                      </div>
                    </div>
                    <div className='input-border flex-grow-0'>
                      <div className='icon grid place-content-center'>
                        <FcBusinesswoman size={`1.3em`} />
                      </div>
                      <div className='input w-full '>
                        <input
                          {...arr.hooks[1].attr}
                          placeholder='Masukkan jumlah angka..'
                          className='input-none py-1 px-2 placeholder:italic placeholder:text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormDemografi;
