const params = {
  outerMarginVertical: 825,
  outerMarginHorizontal: 825,
  outerGapHorizontal: 1000,
  outerThicknessVertical: 1000,
  outerThicknessHorizontal: 1000,
  innerMarginVertical: 825,
  innerMarginHorizontal: 825,
  innerGapHorizontal: 1000,
  innerThicknessVertical: 1000,
  innerThicknessHorizontal: 1000,
};


const constraints = {
  outerMarginVertical: {
    min: 0,
    max: ['innerThicknessVertical', 'innerMarginVertical', 'outerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  outerMarginHorizontal: {
    min: 0,
    max: ['innerThicknessHorizontal', 'innerMarginHorizontal', 'outerThicknessHorizontal', 'innerGapHorizontal'],
    maxAlt: ['outerThicknessHorizontal', 'innerMarginHorizontal', 'outerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: -300,
  },
  outerGapHorizontal: {
    min: 300,
    max: ['outerThicknessHorizontal', 'outerMarginHorizontal'],
    maxOffset: 400,
    maxAltOffset: 0,
  },
  outerThicknessVertical: {
    min: 0,
    max: ['outerMarginVertical', 'innerMarginVertical', 'innerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  outerThicknessHorizontal: {
    min: 0,
    max: ['outerMarginHorizontal', 'innerMarginHorizontal', 'innerThicknessHorizontal', 'innerGapHorizontal'],
    maxAlt: ['outerMarginHorizontal', 'outerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: 500,
  },
  innerMarginVertical: {
    min: 300,
    max: ['outerMarginVertical', 'outerThicknessVertical', 'innerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  innerMarginHorizontal: {
    min: 300,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerThicknessHorizontal', 'innerGapHorizontal'],
    maxOffset: 500,
    maxAltOffset: 0,
  },
  innerGapHorizontal: {
    min: 300,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerMarginHorizontal', 'innerThicknessHorizontal'],
    maxOffset: 600,
    maxAltOffset: 0,
  },
  innerThicknessVertical: {
    min: 0,
    max: ['outerMarginVertical', 'outerThicknessVertical', 'innerMarginVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  innerThicknessHorizontal: {
    min: 0,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerMarginHorizontal', 'innerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
};


const getOuterArray = (params) => {
  params = Object.assign(params, {
    outerHeight: params.cellHeight - params.outerMarginVertical - params.outerMarginVertical,
    outerWidth: params.cellWidth - params.outerMarginHorizontal - params.outerMarginHorizontal,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [o|i|g]    ->  outer | inner | gap
  // [t|r|b|l]  ->  top | right | bottom | left
  const yot = params.cellHeight / 2 - params.outerMarginVertical,
        yit = params.cellHeight / 2 - params.outerMarginVertical - params.outerThicknessVertical,
        yob = -params.cellHeight / 2 + params.outerMarginVertical,
        yib = -params.cellHeight / 2 + params.outerMarginVertical + params.outerThicknessVertical,
        xor = params.cellWidth / 2 - params.outerMarginHorizontal,
        xir = params.cellWidth / 2 - params.outerMarginHorizontal - params.outerThicknessHorizontal,
        xgr = params.outerGapHorizontal / 2,
        xol = -params.cellWidth / 2 + params.outerMarginHorizontal,
        xil = -params.cellWidth / 2 + params.outerMarginHorizontal + params.outerThicknessHorizontal,
        xgl = -params.outerGapHorizontal / 2;

  return [
    [xol, yob],
    [xor, yob],
    [xor, yot],
    [xgr, yot],
    [xgr, yit],
    [xir, yit],
    [xir, yib],
    [xil, yib],
    [xil, yit],
    [xgl, yit],
    [xgl, yot],
    [xol, yot],
    [xol, yob],
  ];
};


const getInnerArray = (params) => {
  params = Object.assign(params, {
    innerHeight: params.outerHeight - params.innerMarginVertical - params.innerMarginVertical,
    innerWidth: params.outerWidth - params.innerMarginHorizontal - params.innerMarginHorizontal,
    innerOffsetTop: params.cellHeight / 2 - params.outerMarginVertical - params.outerThicknessVertical,
    innerOffsetRight: params.cellWidth / 2 - params.outerMarginHorizontal - params.outerThicknessHorizontal,
    innerOffsetBottom: -params.cellHeight / 2 + params.outerMarginVertical + params.outerThicknessVertical,
    innerOffsetLeft: -params.cellWidth / 2 + params.outerMarginHorizontal + params.outerThicknessHorizontal,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [o|i|g]    ->  outer | inner | gap
  // [t|r|b|l]  ->  top | right | bottom | left
  const yot = params.innerOffsetTop - params.innerMarginVertical,
        yit = params.innerOffsetTop - params.innerMarginVertical - params.innerThicknessVertical,
        yob = params.innerOffsetBottom + params.innerMarginVertical,
        yib = params.innerOffsetBottom + params.innerMarginVertical + params.innerThicknessVertical,
        xor = params.innerOffsetRight - params.innerMarginHorizontal,
        xir = params.innerOffsetRight - params.innerMarginHorizontal - params.innerThicknessHorizontal,
        xgr = params.innerGapHorizontal / 2,
        xol = params.innerOffsetLeft + params.innerMarginHorizontal,
        xil = params.innerOffsetLeft + params.innerMarginHorizontal + params.innerThicknessHorizontal,
        xgl = -params.innerGapHorizontal / 2;

  return [
    [xol, yob],
    [xgl, yob],
    [xgl, yib],
    [xil, yib],
    [xil, yit],
    [xir, yit],
    [xir, yib],
    [xgr, yib],
    [xgr, yob],
    [xor, yob],
    [xor, yot],
    [xol, yot],
    [xol, yob],
  ];
};


const download = (outer, inner) => {
  // LEGEND

  return `
    2200 0 1 0
    6 REMCOM 14 ACIS 22.0.1 NT 24 Thu May 17 10:13:02 2018
    1 9.9999999999999995e-007 1e-010
    body $1 -1 -1 $-1 $2 $-1 $3 T -15.5 -15.6 0 15.300660047700928 15.199999999999999 0 #
    ref_vt-eye-attrib $-1 -1 $-1 $-1 $0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    lump $5 -1 -1 $-1 $6 $7 $0 T -15.5 -15.6 0 15.300660047700928 15.199999999999999 0 #
    transform $-1 -1 1 0 0 0 1 0 0 0 1 0 0 0 1 no_rotate no_reflect no_shear #
    eye_refinement $-1 -1 @5 grid  1 @3 tri 1 @4 surf 0 @3 adj 2 @4 grad 0 @9 postcheck 0 @4 stol -1 @4 ntol 13 @4 dsil 0 @8 flatness 0 @7 pixarea 0 @4 hmax 0 @6 gridar 0 @5 mgrid 2048 @5 ugrid 0 @5 vgrid 0 @10 end_fields #
    ref_vt-eye-attrib $-1 -1 $-1 $-1 $2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    lump $8 -1 -1 $-1 $-1 $9 $0 T -10.300000000000006 -10.4 0 10.5 10.6 0 #
    shell $10 -1 -1 $-1 $-1 $-1 $11 $-1 $2 T -15.5 -15.6 0 15.300660047700928 15.199999999999999 0 #
    ref_vt-eye-attrib $-1 -1 $-1 $-1 $6 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    shell $12 -1 -1 $-1 $-1 $-1 $13 $-1 $6 T -10.300000000000006 -10.4 0 10.5 10.6 0 #
    ref_vt-eye-attrib $-1 -1 $-1 $-1 $7 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    face $14 -1 -1 $-1 $-1 $15 $7 $-1 $16 forward double out F F #
    ref_vt-eye-attrib $-1 -1 $-1 $-1 $9 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    face $17 -1 -1 $-1 $-1 $18 $9 $-1 $19 forward double out F F #
    ref_vt-eye-attrib $-1 -1 $20 $-1 $11 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    loop $-1 -1 -1 $-1 $-1 $21 $11 T -15.5 -15.6 0 15.300660047700928 15.199999999999999 0 periphery $16 F #
    plane-surface $-1 -1 -1 $-1 -0.035490401528494954 0.58837027700772326 0 0 0 1 1 0 0 forward_v I I I I #
    ref_vt-eye-attrib $-1 -1 $22 $-1 $13 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 $4 $-1 #
    loop $-1 -1 -1 $-1 $-1 $23 $13 T -10.300000000000006 -10.4 0 10.5 10.6 0 periphery $19 F #
    plane-surface $-1 -1 -1 $-1 0.18666101102675708 -0.52537089736595444 0 0 0 1 1 0 0 forward_v I I I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $14 $11 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @23 face:Sheet Body(cover0) #
    coedge $-1 -1 -1 $-1 $24 $25 $-1 $26 reversed $15 $-1 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $17 $13 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @23 face:Sheet Body(cover1) #
    coedge $-1 -1 -1 $-1 $27 $28 $-1 $29 reversed $18 $-1 #
    coedge $-1 -1 -1 $-1 $30 $21 $-1 $31 reversed $15 $-1 #
    coedge $-1 -1 -1 $-1 $21 $32 $-1 $33 reversed $15 $-1 #
    edge $34 -1 -1 $-1 $35 0 $36 30.602614267411862 $21 $37 forward @7 unknown T ${outer[12]} 0 ${outer[2]} 0 #
    coedge $-1 -1 -1 $-1 $38 $23 $-1 $39 reversed $18 $-1 #
    coedge $-1 -1 -1 $-1 $23 $40 $-1 $41 reversed $18 $-1 #
    edge $42 -1 -1 $-1 $43 0 $44 20.400980368599935 $23 $45 forward @7 unknown T -10.300000000000001 -10.300000000000001 0 -10.1 10.099999999999998 0 #
    coedge $-1 -1 -1 $-1 $46 $24 $-1 $47 reversed $15 $-1 #
    edge $48 -1 -1 $-1 $49 0 $35 11.900420160649791 $24 $50 forward @7 unknown T ${outer[12]} 0 -3.6000000000000001 -15.5 0 #
    coedge $-1 -1 -1 $-1 $25 $51 $-1 $52 reversed $15 $-1 #
    edge $53 -1 -1 $-1 $36 5.8625318986189445e-018 $54 30.300165016052304 $25 $55 forward @7 unknown T ${outer[2]} 0 15.200000000000001 15.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $26 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge11 #
    vertex $56 -1 -1 $-1 $26 $57 #
    vertex $58 -1 -1 $-1 $26 $59 #
    straight-curve $-1 -1 -1 $-1 ${outer[12]} 0 0.013070778741473492 0.9999145737227213 0 I I #
    coedge $-1 -1 -1 $-1 $60 $27 $-1 $61 reversed $18 $-1 #
    edge $62 -1 -1 $-1 $63 0 $43 20.700241544484456 $27 $64 forward @7 unknown T -10.300000000000006 -10.4 0 10.4 -10.300000000000001 0 #
    coedge $-1 -1 -1 $-1 $28 $65 $-1 $66 reversed $18 $-1 #
    edge $67 -1 -1 $-1 $44 -2.2483728392679044e-017 $68 7.9006328860414712 $28 $69 forward @7 unknown T -10.1 10.099999999999998 0 -2.2000000000000002 10.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $29 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge23 #
    vertex $70 -1 -1 $-1 $29 $71 #
    vertex $72 -1 -1 $-1 $29 $73 #
    straight-curve $-1 -1 -1 $-1 -10.300000000000001 -10.300000000000001 0 0.009803450441422416 0.999951945025081 0 I I #
    coedge $-1 -1 -1 $-1 $74 $30 $-1 $75 reversed $15 $-1 #
    edge $76 -1 -1 $-1 $77 0 $49 1 $30 $78 forward @7 unknown T -3.6000000000000001 -15.6 0 -3.6000000000000001 -14.6 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $31 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge10 #
    vertex $79 -1 -1 $-1 $31 $80 #
    straight-curve $-1 -1 -1 $-1 -3.6000000000000001 -15.6 0 -0.99996469362895435 0.0084030646523441249 0 I I #
    coedge $-1 -1 -1 $-1 $32 $81 $-1 $82 reversed $15 $-1 #
    edge $83 -1 -1 $-1 $54 0 $84 30.50016055861763 $32 $85 forward @7 unknown T 15.199999999999999 -15.299994453380666 0 15.300660047700928 15.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $33 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge0 #
    vertex $86 -1 -1 $-1 $52 $87 #
    straight-curve $-1 -1 -1 $-1 ${outer[2]} 0 0.9999945539553261 0.0033003120592584906 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $35 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex11 #
    point $-1 -1 -1 $-1 ${outer[12]} 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $36 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex0 #
    point $-1 -1 -1 $-1 ${outer[2]} 0 #
    coedge $-1 -1 -1 $-1 $88 $38 $-1 $89 reversed $18 $-1 #
    edge $90 -1 -1 $-1 $91 0 $63 20.900239233080562 $38 $92 forward @7 unknown T 10.4 -10.4 0 10.5 10.5 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $39 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge22 #
    vertex $93 -1 -1 $-1 $39 $94 #
    straight-curve $-1 -1 -1 $-1 10.4 -10.4 0 -0.99998833132048581 0.0048308615039636812 0 I I #
    coedge $-1 -1 -1 $-1 $40 $95 $-1 $96 reversed $18 $-1 #
    edge $97 -1 -1 $-1 $68 0 $98 1 $40 $99 forward @7 unknown T -2.2000000000000002 9.1999999999999993 0 -2.2000000000000002 10.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $41 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge12 #
    vertex $100 -1 -1 $-1 $66 $101 #
    straight-curve $-1 -1 -1 $-1 -10.1 10.1 0 0.99991989426029526 0.012657213851396098 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $43 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex23 #
    point $-1 -1 -1 $-1 -10.300000000000001 -10.300000000000001 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $44 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex12 #
    point $-1 -1 -1 $-1 -10.1 10.099999999999998 0 #
    coedge $-1 -1 -1 $-1 $102 $46 $-1 $103 reversed $15 $-1 #
    edge $104 -1 -1 $-1 $105 0 $77 10.900458705944443 $46 $106 forward @7 unknown T -14.5 -14.6 0 -3.5999999999999996 -14.5 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $47 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge9 #
    vertex $107 -1 -1 $-1 $47 $108 #
    straight-curve $-1 -1 -1 $-1 -3.6000000000000001 -14.6 0 0 -1 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $49 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex10 #
    point $-1 -1 -1 $-1 -3.6000000000000001 -15.6 0 #
    coedge $-1 -1 -1 $-1 $51 $109 $-1 $110 reversed $15 $-1 #
    edge $111 -1 -1 $-1 $84 -0.00066007100563938298 $112 11.900420160649791 $51 $113 forward @7 unknown T 3.3999999999999999 -15.4 0 15.300660047700928 -15.299994453380664 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $52 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge1 #
    vertex $114 -1 -1 $-1 $82 $115 #
    straight-curve $-1 -1 -1 $-1 15.199999999999999 15.199999999999999 0 0.0033003120592585517 -0.9999945539553261 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $54 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex1 #
    point $-1 -1 -1 $-1 15.199999999999999 15.199999999999999 0 #
    coedge $-1 -1 -1 $-1 $116 $60 $-1 $117 reversed $18 $-1 #
    edge $118 -1 -1 $-1 $119 0 $91 7.9006328860414721 $60 $120 forward @7 unknown T 2.6000000000000001 10.5 0 10.5 10.6 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $61 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge21 #
    vertex $121 -1 -1 $-1 $61 $122 #
    straight-curve $-1 -1 -1 $-1 10.5 10.5 0 -0.0047846342276178953 -0.99998855357214356 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $63 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex22 #
    point $-1 -1 -1 $-1 10.4 -10.4 0 #
    coedge $-1 -1 -1 $-1 $65 $123 $-1 $124 reversed $18 $-1 #
    edge $125 -1 -1 $-1 $98 0 $126 6.9007245996344473 $65 $127 forward @7 unknown T -9.1000000000000014 9.0999999999999996 0 -2.2000000000000002 9.1999999999999993 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $66 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge13 #
    vertex $128 -1 -1 $-1 $96 $129 #
    straight-curve $-1 -1 -1 $-1 -2.2000000000000002 10.199999999999999 0 0 -1 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $68 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex13 #
    point $-1 -1 -1 $-1 -2.2000000000000002 10.199999999999999 0 #
    coedge $-1 -1 -1 $-1 $130 $74 $-1 $131 reversed $15 $-1 #
    edge $132 -1 -1 $-1 $133 0 $105 28.60279706602136 $74 $134 forward @7 unknown T -14.5 -14.500000000000002 0 ${outer[8]} 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $75 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge8 #
    vertex $135 -1 -1 $-1 $75 $136 #
    straight-curve $-1 -1 -1 $-1 -14.5 -14.5 0 0.99995791865674488 -0.0091739258592361591 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $77 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex9 #
    point $-1 -1 -1 $-1 -3.6000000000000001 -14.6 0 #
    coedge $-1 -1 -1 $-1 $81 $130 $-1 $137 reversed $15 $-1 #
    edge $138 -1 -1 $-1 $112 0 $139 1 $81 $140 forward @7 unknown T 3.3999999999999999 -15.4 0 3.3999999999999999 -14.4 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $82 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge2 #
    vertex $141 -1 -1 $-1 $110 $142 #
    straight-curve $-1 -1 -1 $-1 15.300000000000001 -15.300000000000001 0 -0.99996469362895435 -0.0084030646523441249 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $84 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex2 #
    point $-1 -1 -1 $-1 15.300660047700928 -15.299994453380664 0 #
    coedge $-1 -1 -1 $-1 $143 $88 $-1 $144 reversed $18 $-1 #
    edge $145 -1 -1 $-1 $146 0 $119 1 $88 $147 forward @7 unknown T 2.6000000000000001 9.5999999999999996 0 2.6000000000000001 10.6 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $89 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge20 #
    vertex $148 -1 -1 $-1 $89 $149 #
    straight-curve $-1 -1 -1 $-1 2.6000000000000001 10.6 0 0.99991989426029526 -0.012657213851396098 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $91 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex21 #
    point $-1 -1 -1 $-1 10.5 10.5 0 #
    coedge $-1 -1 -1 $-1 $95 $143 $-1 $150 reversed $18 $-1 #
    edge $151 -1 -1 $-1 $126 0 $152 18.401086924418351 $95 $153 forward @7 unknown T -9.3000000000000007 -9.3000000000000007 0 -9.0999999999999996 9.0999999999999996 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $96 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge14 #
    vertex $154 -1 -1 $-1 $124 $155 #
    straight-curve $-1 -1 -1 $-1 -2.2000000000000002 9.1999999999999993 0 -0.99989499658709968 -0.014491231834595598 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $98 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex14 #
    point $-1 -1 -1 $-1 -2.2000000000000002 9.1999999999999993 0 #
    coedge $-1 -1 -1 $-1 $109 $102 $-1 $156 reversed $15 $-1 #
    edge $157 -1 -1 $-1 $158 0 $133 28.30017667789372 $102 $159 forward @7 unknown T ${outer[8]} 0 14.199999999999999 14.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $103 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge7 #
    vertex $160 -1 -1 $-1 $103 $161 #
    straight-curve $-1 -1 -1 $-1 ${outer[8]} 0 -0.013984646294441589 -0.99990221005257274 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $105 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex8 #
    point $-1 -1 -1 $-1 -14.5 -14.5 0 #
    edge $162 -1 -1 $-1 $139 0 $163 10.8945180417593 $109 $164 forward @7 unknown T 3.3999999999999999 -14.4 0 14.294059585805988 -14.30005449921279 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $110 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge3 #
    vertex $165 -1 -1 $-1 $137 $166 #
    straight-curve $-1 -1 -1 $-1 3.3999999999999999 -15.4 0 0 1 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $112 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex3 #
    point $-1 -1 -1 $-1 3.3999999999999999 -15.4 0 #
    coedge $-1 -1 -1 $-1 $123 $116 $-1 $167 reversed $18 $-1 #
    edge $168 -1 -1 $-1 $169 0 $146 6.9007245996344482 $116 $170 forward @7 unknown T 2.5999999999999988 9.5 0 9.5 9.5999999999999996 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $117 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge19 #
    vertex $171 -1 -1 $-1 $117 $172 #
    straight-curve $-1 -1 -1 $-1 2.6000000000000001 9.5999999999999996 0 0 1 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $119 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex20 #
    point $-1 -1 -1 $-1 2.6000000000000001 10.6 0 #
    edge $173 -1 -1 $-1 $152 0 $174 18.700267377767627 $123 $175 forward @7 unknown T -9.3000000000000007 -9.4000000000000004 0 9.4000000000000021 -9.3000000000000007 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $124 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge15 #
    vertex $176 -1 -1 $-1 $150 $177 #
    straight-curve $-1 -1 -1 $-1 -9.0999999999999996 9.0999999999999996 0 -0.010868923168587388 -0.99994093151003438 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $126 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex15 #
    point $-1 -1 -1 $-1 -9.0999999999999996 9.0999999999999996 0 #
    edge $178 -1 -1 $-1 $163 -3.4274571582165209e-005 $158 28.50017543805652 $130 $179 forward @7 unknown T 14.199999999999999 -14.30005449921279 0 14.294059585805988 14.200000000000003 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $131 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge6 #
    vertex $180 -1 -1 $-1 $131 $181 #
    straight-curve $-1 -1 -1 $-1 14.199999999999999 14.199999999999999 0 -0.99999375700386117 -0.0035335468445365998 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $133 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex7 #
    point $-1 -1 -1 $-1 ${outer[8]} 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $137 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge4 #
    vertex $182 -1 -1 $-1 $156 $183 #
    straight-curve $-1 -1 -1 $-1 3.3999999999999999 -14.4 0 0.99995791865674488 0.0091739258592361591 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $139 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex4 #
    point $-1 -1 -1 $-1 3.3999999999999999 -14.4 0 #
    edge $184 -1 -1 $-1 $174 0 $169 18.900264548413073 $143 $185 forward @7 unknown T 9.4000000000000004 -9.4000000000000004 0 9.5 9.5000000000000018 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $144 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge18 #
    vertex $186 -1 -1 $-1 $144 $187 #
    straight-curve $-1 -1 -1 $-1 9.5 9.5 0 -0.99989499658709968 0.014491231834595594 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $146 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex19 #
    point $-1 -1 -1 $-1 2.6000000000000001 9.5999999999999996 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $150 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge16 #
    vertex $188 -1 -1 $-1 $167 $189 #
    straight-curve $-1 -1 -1 $-1 -9.3000000000000007 -9.3000000000000007 0 0.99998570192809422 -0.00534751712261011 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $152 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex16 #
    point $-1 -1 -1 $-1 -9.3000000000000007 -9.3000000000000007 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $156 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @5 edge5 #
    straight-curve $-1 -1 -1 $-1 14.294059472689206 -14.300020224827868 0 -0.0033003120592586745 0.9999945539553261 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $158 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex6 #
    point $-1 -1 -1 $-1 14.199999999999999 14.199999999999999 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $163 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @7 vertex5 #
    point $-1 -1 -1 $-1 14.294059585805988 -14.30005449921279 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $167 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @6 edge17 #
    straight-curve $-1 -1 -1 $-1 9.4000000000000004 -9.4000000000000004 0 0.005290931232409442 0.99998600292538797 0 I I #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $169 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex18 #
    point $-1 -1 -1 $-1 9.5 9.5 0 #
    remcom_name_attrib-remcom-attrib $-1 -1 $-1 $-1 $174 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 @8 vertex17 #
    point $-1 -1 -1 $-1 9.4000000000000004 -9.4000000000000004 0 #
    End-of-ACIS-data
  `.trim().replace(/  +/g, '');
}

export default {
  name: 'square ring',
  params,
  constraints,
  shapes: [
    {
      id: 1,
      points: getOuterArray,
    },
    {
      id: 2,
      points: getInnerArray,
    },
  ],
  download,
};
