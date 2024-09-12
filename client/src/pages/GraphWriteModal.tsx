import React, { useState } from 'react';

interface GraphWriteModalProps {
  onClose: () => void;
  onSaveTitle: (title: string, index: number) => void;
  onSaveOld: (old: number, index: number) => void;
  onSaveScore: (score: number, index: number) => void;
  onSaveEvent: (event: string, index: number) => void;
}

const GraphWriteModal: React.FC<GraphWriteModalProps> = ({onClose, onSaveTitle, onSaveOld, onSaveScore, onSaveEvent }) => {
  const [inputs, setInputs] = useState([
    { title: '', old: '', score: 0, event: '' }, // 초기 기본 요소 하나 추가
  ]);

  // + 버튼 클릭시 input 요소 추가
  const handleAddInput = () => {
    setInputs([...inputs, { title: '', old: '', score: 0, event: '' }]);
  };

  // - 버튼 클릭시 input 요소 제거
  const handleRemoveInput = (index: number) => {
    const updateInputs = inputs.filter((_, i) => i !== index);
    setInputs(updateInputs);
  };

  // 제목 유효성 검사 함수
  // (index: number) 추가
  const handleSaveTitle = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].title = value; // 특정 index의 title 업데이트

    if (value.length > 15) {
      // 제목이 15자를 초과할 경우 에러 메시지 설정
      setError((prev) => ({ ...prev, title: '15자 이하로 적어주세요.' }));
    } else {
      setError((prev) => ({ ...prev, title: '' }));
    }
    setInputs(newInputs); // inputs 상태 업데이트
    onSaveTitle(value, index)
  };

  // 나이 유효성 검사 함수
  // (index: number) 추가
  const handleSaveOld = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].old = value; // 특정 index의 old 업데이트

    if (!/^\d+$/.test(value)) {
      // 숫자 외 입력 시 에러 메시지 설정
      setError((prev) => ({ ...prev, old: '숫자만 입력해 주세요' }));
    } else {
      setError((prev) => ({ ...prev, old: '' }));
    }
    setInputs(newInputs); // inputs 상태 업데이트
    onSaveOld(Number(value), index)
  };

  // 점수 저장 함수
  // (index: number) 추가
  const handleSaveScore = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const value = Number(e.target.value);
    const newInputs = [...inputs];
    newInputs[index].score = value; // 특정 index의 score 업데이트
    setInputs(newInputs); // inputs 상태 업데이트
    onSaveScore(value, index);
  };

  // 이벤트 유효성 검사 함수
  // (index: number) 추가
  const handleSaveEvent = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index].event = value; // 특정 index의 event 업데이트

    if (value.length > 50) {
      // 이벤트가 50자를 초과할 경우 에러 메시지 설정
      setError((prev) => ({ ...prev, event: '50자 이하로 적어주세요.' }));
    } else {
      setError((prev) => ({ ...prev, event: '' }));
    }
    setInputs(newInputs); // inputs 상태 업데이트
    onSaveEvent(value, index)
  };

  // 에러 상태 관리
  const [error, setError] = useState({
    title: '',
    old: '',
    event: '',
  });

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#585858] bg-opacity-30" onClick={onClose}>
      <div className="flex flex-col w-[700px] h-[870px] rounded-[20px] bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <div onClick={onClose} className="flex flex-wrap p-[20px] text-[24px] cursor-pointer">
            x
          </div>
        </div>
        <div className="pl-[60px]">
          <div className="mt-[70px] font-bold text-[25px]">
            인생 그래프 구성에 대한 정보를<br />적어주세요!
          </div>

          <div className="mt-[50px] flex flex-col gap-[5px]">
            <div>현재 나이</div>
            <input className="bg-[#f3f3f3] pl-[10px] w-[200px] h-[40px] rounded-[10px] border outline-none" placeholder="나이를 적어주세요" />
          </div>
          {/* 이 부분이 스크롤 형식으로 차지하는 부분 overflow-x-hidden overflow-y-auto */}
          <div className="mt-[15px] h-[350px] items-center gap-[10px] overflow-x-hidden overflow-y-auto">
            {/* inputs 배열의 각 요소를 map으로 렌더링 */}
            {inputs.map((input, index) => (
                // 바로 아래의 div는 정렬을 위해 이벤트 input을 아래로 보내기 위해 한번더 div로 감쌌음
                <div> 
                    <div key={index} className="flex gap-[10px]">
                        <div className='Title-input'>
                            <div>제목</div>
                                <input
                                value={input.title}
                                onChange={(e) => handleSaveTitle(e, index)} // index를 함께 전달하여 특정 요소만 업데이트
                                className="w-[300px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none"
                                placeholder="최대 15자"
                                />
                            {error.title && <div className="text-red-500">{error.title}</div>}
                        </div>
                        <div className='Old-input'>
                            <div>나이</div>
                                <input
                                value={input.old}
                                onChange={(e) => handleSaveOld(e, index)} // index를 함께 전달하여 특정 요소만 업데이트
                                className="w-[90px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none"
                                placeholder="나이만"
                                />
                            {error.old && <div className="text-red-500">{error.old}</div>}
                        </div>
                        <div className='Score-input'>
                            <div>점수</div>
                                <select
                                value={input.score}
                                onChange={(e) => handleSaveScore(e, index)} // index를 함께 전달하여 특정 요소만 업데이트
                                className="w-[90px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none"
                                >
                                {Array.from({ length: 11 }, (_, i) => i - 5).map((value) => (
                                    <option key={value} value={value}>
                                    {value}
                                    </option>
                                ))}
                                </select>
                        </div>
                        <div className="Buttons flex mt-[10px] gap-[10px] pt-[20px]">
                        {/* + 버튼: 새로운 input 그룹 추가 */}
                        <button onClick={handleAddInput}
                        className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">
                            +
                        </button>
                        {/* - 버튼: 특정 index의 input 그룹 제거 */}
                        <button onClick={() => handleRemoveInput(index)}
                        className="flex justify-center w-[30px] h-[30px] bg-[#909700] rounded-[6px] text-white font-bold text-[20px]">
                            -
                        </button>
                    </div>
                </div>

                <div className="Event-input mt-[10px] flex">
                    <input
                        value={inputs[0].event} // 첫 번째 input 그룹의 이벤트만 관리
                        onChange={(e) => handleSaveEvent(e, 0)}
                        className="w-[580px] h-[40px] rounded-[10px] bg-[#F8F8F8] pl-[10px] outline-none"
                        placeholder="어떤 이벤트가 있었나요? 기억하고 싶은 것을 메모하세요. (선택)"
                    />
                </div>
              </div>
            ))}
            
          </div>
        </div>
        <div className="flex justify-center mt-[90px] w-full h-[50px] pl-[20px]">
          <button className="flex justify-center w-[220px] bg-[#909700] rounded-[10px] font-bold text-25px] text-white justify-center items-center">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphWriteModal;
