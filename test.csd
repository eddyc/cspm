<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

opcode A, k, k

kin xin

    kout = 1 + p4

xout kout

endop

opcode B, k, k

kin xin

    kout A kin

xout kout

endop

opcode B, k, k

kin xin

    kout A kin

xout kout

endop


instr 1

    kout B 1

endin

schedule(1, 0, -1, 5)

</CsInstruments>
</CsoundSynthesizer>
