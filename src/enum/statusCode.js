// meta design house http status and error message enum
const enums = {
    space_simul_init : {CODE: 1001,  MESSAGE: '공간에 시뮬레이션을 세팅합니다.'},
    space_simul_ing : {CODE: 1100,  MESSAGE: '공간에 시뮬레이션을 진행중입니다.'},
    space_simul_end : {CODE: 1200,  MESSAGE: '공간에 시뮬레이션이 완료했습니다.'},
    space_mode_simul: {CODE: 2001, MESSAGE:'시뮬레이션 모드'},
    space_mode_moni: {CODE: 2002, MESSAGE:'모니터링 모드'},
    space_mode_editor: {CODE: 2003, MESSAGE:'애디터 모드'},

 };
 
 module.exports = { enums };