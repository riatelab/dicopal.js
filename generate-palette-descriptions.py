#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Note that this script need the 'palettable' Python library (https://jiffyclub.github.io/palettable/).
"""
import palettable
import re
import json

if __name__ == '__main__':
    # A list of colorblind-friendly palette (retrieved using a SPARQL query against a triplestore containing the dicopal RDF vocabulary
    # and completed by adding the various variations of the "Safe" color scheme from CartoColors).
    # This list should be improved, as it does not cover all the palettes present palettable Python library.
    cbf = ['RdPu_6', 'Bilbao_7', 'RdBu_5', 'BuPu_7', 'PiYG_6', 'Bilbao_3', 'YlGn_9', 'Broc_4', 'PuBu_3', 'RdBu_3', 'Set2_3', 'PuBu_6', 'Acton_8', 'Acton_6', 'BrBG_8', 'Greys_5', 'PiYG_10', 'PuBuGn_6', 'PuBuGn_7', 'Purples_3', 'Reds_6', 'GnBu_3', 'PRGn_7', 'PiYG_8', 'Broc_11', 'PuOr_8', 'Greys_8', 'GnBu_9', 'OrRd_8', 'YlOrBr_7', 'GnBu_6', 'YlOrBr_3', 'PiYG_7', 'Blues_9', 'Broc_10', 'BrBG_9', 'BuGn_4', 'Okabe_Ito_Categorigal_8', 'PuBu_4', 'Blues_4', 'PRGn_10', 'RdYlBu_10', 'Paired_3', 'PuRd_4', 'BrBG_7', 'YlOrRd_8', 'Greys_4', 'RdPu_9', 'YlGnBu_4', 'Blues_7', 'BrBG_4', 'Greens_4', 'RdYlBu_5', 'Oranges_5', 'Oranges_6', 'Broc_7', 'PRGn_8', 'Purples_4', 'OrRd_4', 'YlGn_6', 'RdBu_10', 'YlGnBu_9', 'Purples_6', 'BuGn_8', 'PuOr_9', 'BuPu_5', 'YlOrBr_4', 'BuPu_9', 'PiYG_5', 'Greens_7', 'Bilbao_4', 'Bilbao_8', 'PuBu_7', 'YlGnBu_8', 'Acton_9', 'PuBuGn_3', 'BuPu_8', 'Greens_3', 'Broc_9', 'Oranges_8', 'PuOr_3', 'RdYlBu_7', 'BrBG_6', 'PiYG_4', 'Broc_8', 'PuRd_6', 'PuBuGn_9', 'Broc_3', 'Greys_7', 'RdYlBu_11', 'BuGn_3', 'Reds_3', 'RdPu_8', 'Oranges_9', 'PRGn_11', 'BuPu_4', 'OrRd_7', 'BuGn_5', 'GnBu_5', 'GnBu_8', 'YlGnBu_7', 'OrRd_6', 'YlOrRd_3', 'Reds_9', 'PuOr_10', 'BuPu_3', 'RdBu_11', 'RdBu_8', 'PuOr_4', 'Blues_8', 'PRGn_9', 'RdYlBu_3', 'GreenMagenta_16', 'PuRd_8', 'Blues_3', 'Broc_6', 'Purples_5', 'Purples_7', 'Greys_3', 'RdBu_9', 'RdYlBu_9', 'BuGn_6', 'Greens_8', 'PiYG_3', 'Blues_6', 'YlOrBr_8', 'YlGn_7', 'RdPu_3', 'BuGn_9', 'OrRd_3', 'RdPu_7', 'PRGn_4', 'PuBuGn_4', 'GnBu_4', 'PRGn_5', 'PuRd_5', 'PuOr_7', 'BrBG_11', 'RdYlBu_6', 'YlGnBu_5', 'YlGn_5', 'PuBu_8', 'Greys_6', 'Acton_3', 'Acton_4', 'BrBG_5', 'Bilbao_5', 'Bilbao_9', 'Oranges_7', 'Oranges_3', 'RdBu_4', 'Reds_5', 'Reds_8', 'RdYlBu_4', 'PuBuGn_8', 'PiYG_9', 'BrBG_3', 'PuOr_5', 'Reds_7', 'YlOrBr_5', 'YlOrBr_9', 'YlOrRd_4', 'Greens_9', 'YlGnBu_6', 'Greens_6', 'BuGn_7', 'YlOrRd_5', 'RdBu_7', 'Reds_4', 'PuRd_7', 'PuBuGn_5', 'Purples_9', 'BrBG_10', 'PRGn_6', 'PuRd_3', 'YlGn_3', 'RdPu_4', 'YlOrRd_7', 'OrRd_5', 'RdYlBu_8', 'BuPu_6', 'Dark2_3', 'Acton_7', 'PuRd_9', 'Bilbao_6', 'PiYG_11', 'Oranges_4', 'PuOr_11', 'RdPu_5', 'PuBu_5', 'YlGnBu_3', 'YlOrBr_6', 'Purples_8', 'Greens_5', 'PRGn_3', 'RdBu_6', 'Paired_4', 'YlGn_4', 'YlGn_8', 'PuBu_9', 'YlOrRd_6', 'Broc_5', 'Greys_9', 'Blues_5', 'PuOr_6', 'GnBu_7', 'OrRd_9', 'Acton_5', 'Safe_2', 'Safe_3', 'Safe_4', 'Safe_5', 'Safe_6', 'Safe_7', 'Safe_8', 'Safe_9', 'Safe_10']

    # Modules of palettable that contain palettes
    modules = [
        ('cartocolors', 'diverging'),
        ('cartocolors', 'sequential'),
        ('cartocolors', 'qualitative'),
        ('cmocean', 'diverging'),
        ('cmocean', 'sequential'),
        ('colorbrewer', 'diverging'),
        ('colorbrewer', 'qualitative'),
        ('colorbrewer', 'sequential'),
        ('lightbartlein', 'diverging'),
        ('lightbartlein', 'sequential'),
        ('matplotlib', ''),
        ('mycarta', ''),
        ('scientific', 'diverging'),
        ('scientific', 'sequential'),
        ('tableau', ''),
        ('wesanderson', ''),
    ]

    res = {}

    for mod1, mod2 in modules:
        if mod2 != '':
            module = getattr(getattr(palettable, mod1), mod2)
        else:
            module = getattr(palettable, mod1)

        module_content = [e for e in dir(module) if re.search("_\d", e)]

        if res.get(mod1) is None:
            res[mod1] = {}

        for pal_name in module_content:
            pal = getattr(module, pal_name)

            # We dont store the reversed version of the palettes
            is_reversed = False if not re.search("_r$", pal.name) else True
            if is_reversed: continue

            try:
                short_name = pal.name[:re.search("_\d(\d)?$", pal.name).start()]
            except:
                short_name = pal.name

            if res[mod1].get(short_name) is None:
                res[mod1][short_name] = {}
                res[mod1][short_name]['type'] = pal.type
                res[mod1][short_name]['values'] = {}

            _id = f'{short_name}_{pal.number}'

            res[mod1][short_name]['values'][pal.number] = pal.hex_colors

            if hasattr(pal, 'url') and not res[mod1][short_name].get('url'):
                res[mod1][short_name]['url'] = pal.url
            elif mod1 == 'colorbrewer':
                # Colorbrewer URL is missing in palettable palette descriptions
                res[mod1][short_name]['url'] = 'https://colorbrewer2.org/'

    # Add the palette from Okabe & Ito
    # (values were also retrieved using a SPARQL request from the dicopal RDF vocabulary).
    res['otakeito'] = {
        "Okabe_Ito_Categorigal": {
            "type": "qualitative",
            "values": { 8:
               ['#000000',
                 '#e69f00',
                 '#56b4e9',
                 '#009e73',
                 '#f0e442',
                 '#0072b2',
                 '#d55e00',
                 '#cc79a7']
            },
            "url": "https://jfly.uni-koeln.de/color/",
        }
    }

    with open('./src/palettes.json', 'w') as f:
        f.write(json.dumps(res, indent=4))

    with open('./src/cbf.json', 'w') as f:
        f.write(json.dumps(cbf))
