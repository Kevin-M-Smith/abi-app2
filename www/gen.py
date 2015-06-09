#!/usr/bin/python

import json
import os
import re

path = "img/fotos"

ruta_base = "img/fotos"
data = {}
data['ordenes'] = []


def tofront(l, v):
    l.remove(v)
    l.insert(0, v)

for orden in os.listdir(ruta_base):
    ruta_orden = os.path.join(ruta_base, orden)
    if os.path.isdir(ruta_orden):
        orden_tmp = {}
        orden_tmp['nombre'] = orden
        orden_tmp['familias'] = []

        familias = os.listdir(ruta_orden)

        if orden == 'Ephemeroptera':
            tofront(familias, 'Leptophlebiidae_10')
            tofront(familias, 'Baetidae_4')

        if orden == 'Heteroptera':
            tofront(familias, 'Notonectidae_5')
            tofront(familias, 'Corixidae_5')

        if orden == 'Trichoptera':
            tofront(familias, 'Odontoceridae_10')
            tofront(familias, 'Leptoceridae_8')
            tofront(familias, 'Hydrobiosidae_8')

        if orden == 'Coleoptera':
            tofront(familias, 'Scirtidae_5')
            tofront(familias, 'Hidrophilidae_3')
            tofront(familias, 'Elmidae_5')

        if orden == 'Diptera':
            tofront(familias, 'Tipulidae_5')
            tofront(familias, 'Tabanidae_4')
            tofront(familias, 'Simuliidae_5')
            tofront(familias, 'Muscidae_2')
            tofront(familias, 'Empididae_4')
            tofront(familias, 'Dolichopodidae_4')
            tofront(familias, 'Chironomidae_2')
            tofront(familias, 'Ceratopogonidae_4')
            tofront(familias, 'Blephariceridae_10')

        for familia in familias:
            ruta_familia = os.path.join(ruta_orden, familia)
            #print ruta_orden
            #print familia
            if os.path.isdir(ruta_familia):
                #print "is dir"
                familia_tmp = {}
                familia_tmp['nombre'], tmp, familia_tmp['puntos'] = re.search('(.*)(_)([0-9]{1,2})', familia).groups()
                familia_tmp['fotos'] = []
                #print familia_tmp
                for foto in os.listdir(ruta_familia):
                    if not foto.startswith('.'):
                        familia_tmp['fotos'].append(os.path.join(ruta_familia, foto))
                orden_tmp['familias'].append(familia_tmp)
        data['ordenes'].append(orden_tmp)

json_data = json.dumps(data)

print "define(" + json_data + ");"
