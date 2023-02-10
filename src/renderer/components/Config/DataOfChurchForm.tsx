import { Dispatch, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ImSpinner2 } from 'react-icons/im';
import { ResetButton } from '../ResetButton';
import { SubmitButton } from '../SubmitButton';
import logoEmptySrc from '../../assets/logo-empty.png';
import { states } from '../../utils/states';
import type { ChurchData } from '../../App';

interface DataOfChurchFormProps {
  afterSubmit?: () => void;
  isInitialConfig?: boolean;
  setShow?: Dispatch<React.SetStateAction<boolean>>;
  setToBalanceConfig?: Dispatch<React.SetStateAction<boolean>>;
  churchData?: ChurchData;
}

const INITIAL_PREVIEW_IMAGE = {
  filename: 'nome-do-arquivo',
  src: logoEmptySrc,
};

const INITIAL_STATE: ChurchData = {
  logoSrc: '',
  name: '',
  foundationDate: '',
  cnpj: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: '',
  cep: '',
};

export function DataOfChurchForm({
  isInitialConfig,
  setShow,
  setToBalanceConfig,
  afterSubmit,
  churchData,
}: DataOfChurchFormProps) {
  const [data, setData] = useState({ ...INITIAL_STATE });
  const [previewImage, setPreviewImage] = useState({
    ...INITIAL_PREVIEW_IMAGE,
  });
  const [loading, setLoading] = useState(false);
  const [loadPreviewImage, setLoadPreviewImage] = useState(false);

  useEffect(() => {
    const getDataOfChurch = async () => {
      try {
        if (churchData) {
          setData(churchData);
          setPreviewImage({
            filename: 'logo-da-igreja',
            src: churchData.logoSrc,
          });
        }
      } catch (err) {
        toast.error((err as Error).message);
      }
    };
    if (!isInitialConfig) getDataOfChurch();
  }, [churchData, isInitialConfig]);

  const imageValidate = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return false;
    }

    const allowedExtensions = /(\.png|\.jpeg|\.jpg)$/i;

    if (!allowedExtensions.exec(files[0].name)) {
      toast.error(
        'Extensão de arquivo inválida. Arquivo deve possuir as extensões ".png", ".jpeg" ou ".jpg"',
        {
          progress: undefined,
        }
      );
      return false;
    }

    const maxSize = 1024 * 1024 * 2; // 2MB

    if (files[0].size > maxSize) {
      toast.warn('Tamanho de arquivo deve ser no máximo 2MB', {
        progress: undefined,
      });
      return false;
    }
    return true;
  };

  const imageToBase64 = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise<string>((resolve) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        toast.error('Erro ao carregar imagem', {
          progress: undefined,
        });
      };
    });
  };

  const dateMask = (value: string) => {
    const date = value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1');

    setData({
      ...data,
      foundationDate: date,
    });
  };

  const cnpjMask = (value: string) => {
    const cnpj = value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

    setData({
      ...data,
      cnpj,
    });
  };

  const cepMask = (value: string) => {
    const cep = value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');

    setData({
      ...data,
      cep,
    });
  };

  const handleChange = async ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = target as HTMLInputElement;
    if (name === 'logoSrc') {
      if (imageValidate(files)) {
        setLoadPreviewImage(true);
        try {
          const src = await imageToBase64((files as FileList)[0]);

          setPreviewImage({
            filename: (files as FileList)[0].name,
            src,
          });
          setData({
            ...data,
            logoSrc: src,
          });
          return;
        } finally {
          setLoadPreviewImage(false);
        }
      }
      return;
    }
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await window.dataOfChurch.createOrUpdate({
        ...data,
        foundationDate: new Date(
          data.foundationDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2-$1-$3')
        ),
      });
      toast.success('Dados da igreja adicionados com sucesso');
      if (isInitialConfig) {
        (setToBalanceConfig as Dispatch<React.SetStateAction<boolean>>)(true);
      }
      if (!isInitialConfig) {
        (setShow as Dispatch<React.SetStateAction<boolean>>)(false);
        (afterSubmit as () => void)();
      }
    } catch (err) {
      toast.error(
        `Erro ao adicionar dados da igreja: ${(err as Error).message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (
    event: FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isInitialConfig) {
      (setShow as Dispatch<React.SetStateAction<boolean>>)(false);
    }
    setPreviewImage({ ...INITIAL_PREVIEW_IMAGE });
    setData({ ...INITIAL_STATE });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="text-sm w-full text-zinc-600 flex flex-col items-center justify-center gap-8"
    >
      <div className="flex w-full gap-20">
        <div className="flex flex-col w-2/3 gap-7">
          <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-full">
            <input
              required
              title="Nome da igreja"
              name="name"
              placeholder="Nome"
              onChange={handleChange}
              value={data.name}
              className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
              maxLength={50}
            />
            <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
              Ex: Igreja Batista de Marco II
            </span>
          </label>
          <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-2/4">
            <input
              required
              title="Data de fundação da igreja"
              name="foundationDate"
              placeholder="Data de fundação"
              onChange={handleChange}
              value={data.foundationDate}
              className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
              onKeyUp={(e) => dateMask(e.currentTarget.value)}
              maxLength={10}
            />
            <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
              Ex: 01/01/2021
            </span>
          </label>
          <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-2/4">
            <input
              required
              title="CNPJ da igreja"
              name="cnpj"
              placeholder="CNPJ"
              onChange={handleChange}
              value={data.cnpj}
              className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
              onKeyUp={(e) => cnpjMask(e.currentTarget.value)}
              maxLength={18}
            />
            <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
              Ex: 00.000.000/001-00
            </span>
          </label>
          <div className="w-full flex gap-4">
            <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-full">
              <input
                required
                title="Logradouro da igreja"
                name="street"
                placeholder="Logradouro"
                onChange={handleChange}
                value={data.street}
                className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
                maxLength={50}
              />
              <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
                Ex: Rua/Av./Praça Paraíso (não colocar o número)
              </span>
            </label>
            <label className="relative flex items-center bg-zinc-900 p-2 rounded-sm w-1/5">
              <input
                required
                title="Número"
                name="number"
                placeholder="Número"
                onChange={handleChange}
                value={data.number}
                className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
                maxLength={5}
              />
              <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
                Ex: 127
              </span>
            </label>
          </div>
          <div className="w-full flex gap-4">
            <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-1/2">
              <input
                required
                title="Bairro da igreja"
                name="district"
                placeholder="Bairro"
                onChange={handleChange}
                value={data.district}
                className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
                maxLength={50}
              />
            </label>
            <label className="relative flex items-center bg-zinc-900 p-2 rounded-sm w-1/2">
              <input
                required
                title="Cidade da igreja"
                name="city"
                placeholder="Cidade"
                onChange={handleChange}
                value={data.city}
                className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
                maxLength={50}
              />
              <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
                Ex: Nova Iguaçu
              </span>
            </label>
          </div>
          <div className="w-full flex gap-4">
            <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-1/2">
              <select
                required
                title="Selecione o estado da igreja"
                name="state"
                value={data.state}
                onChange={handleChange}
                className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal text-zinc-200"
              >
                <option value="" disabled>
                  Selecione o estado da igreja
                </option>
                {states.map(({ name, abbreviation }) => (
                  <option value={abbreviation} key={abbreviation}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative flex items-center bg-zinc-900 p-2 rounded-sm w-1/2">
              <input
                required
                title="CEP da igreja"
                name="cep"
                placeholder="CEP"
                onChange={handleChange}
                value={data.cep}
                className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal text-zinc-200"
                onKeyUp={(e) => cepMask(e.currentTarget.value)}
                maxLength={10}
              />
              <span className="absolute w-max -bottom-4 text-xs italic text-zinc-500 left-0">
                Ex: 26.000-000
              </span>
            </label>
          </div>
        </div>
        <div className="w-1/3 h-max flex flex-col items-center gap-4">
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 px-2 pt-2 pb-1 border-b-0 rounded-md rounded-b-none border flex flex-col items-center justify-center">
              <img
                className={`relative m-auto object-cover z-40 ${
                  loadPreviewImage ? 'opacity-60' : 'opacity-100'
                }`}
                src={previewImage.src}
                alt="logo da igreja"
              />
              <div
                className={`absolute w-full h-full ${
                  loadPreviewImage ? 'flex' : 'hidden'
                } items-center justify-center z-50`}
              >
                <ImSpinner2 className="w-8 h-8 animate-spin fill-zinc-900" />
              </div>
            </div>
            <span
              className="text-xs text-zinc-500 italic truncate w-40 h-5 px-2 text-center bg-zinc-200 border-t-0 rounded-md rounded-t-none"
              title={previewImage.filename}
            >
              {previewImage.filename}
            </span>
          </div>
          <label
            className="w-44 cursor-pointer text-center bg-zinc-900 p-2 rounded-md text-zinc-200 hover:bg-teal-500 hover:text-zinc-900"
            htmlFor="logo-church"
          >
            Escolha a logo da igreja
            <input
              id="logo-church"
              type="file"
              className="hidden"
              title="Escolha o logo da igreja"
              name="logoSrc"
              placeholder="Escolha o logo da igreja"
              onChange={handleChange}
              src={data.logoSrc}
            />
          </label>
        </div>
      </div>
      <div className="bg-gray-50 pt-6 gap-2 flex w-2/3 items-center text-zinc-200">
        <SubmitButton
          className="w-1/5 h-8"
          text="SALVAR"
          isLoading={loading}
          title="Salvar dados da igreja"
        />
        <ResetButton
          title="Cancelar configuração de dados da igreja"
          className="w-1/5 h-8"
          text={isInitialConfig ? 'LIMPAR' : 'CANCELAR'}
        />
      </div>
    </form>
  );
}
