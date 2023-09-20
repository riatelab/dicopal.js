#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Note that this script need the 'palettable' Python library (https://jiffyclub.github.io/palettable/).
"""
import palettable
import re
import json

# Some helpers functions to help with the preparation of palette from Joshua Stevens
def sample(palette, num_samples):
    length = len(palette)

    # Calculate the step size
    step_size = (length - 1) / (num_samples - 1)
    # Initialize an empty sampled list
    sampled = []
    # Add the first entry
    sampled.append(palette[0])

    # Iterate through the indices
    for i in range(1, num_samples - 1):
        # Calculate the index based on the step size
        index = int(i * step_size)
        # Add the value at the calculated index
        sampled.append(palette[index])

    # Add the last entry
    sampled.append(palette[-1])

    return sampled

def make_color_tuple(color):
    return (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16))

def interpolate_rgb(startcolor, goalcolor):
    r, g, b = startcolor
    target_r, target_g, target_b = goalcolor

    diff_r = target_r - r
    diff_g = target_g - g
    diff_b = target_b - b

    i_r = int(r + (diff_r * 1 / 2))
    i_g = int(g + (diff_g * 1 / 2))
    i_b = int(b + (diff_b * 1 / 2))

    h_r = str(hex(i_r)).replace("0x", "")
    h_g = str(hex(i_g)).replace("0x", "")
    h_b = str(hex(i_b)).replace("0x", "")

    if len(h_r) == 1:
        h_r = "0" + h_r
    if len(h_g) == 1:
        h_g = "0" + h_g
    if len(h_b) == 1:
        h_b = "0" + h_b
            
    return "#" + h_r + h_g + h_b

def interpolate(startcolor, goalcolor):
    return interpolate_rgb(
        make_color_tuple(startcolor),
        make_color_tuple(goalcolor),
    )

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

    # Add palettes from Joshua Stevens:
    res['joshuastevens'] = {}
    # Carrots Palette : https://gist.github.com/jscarto/167b38829aa9eb3758a4f8b1bc3d723f / https://twitter.com/jscarto/status/998627052608729088
    carrots = ['#372442','#4e1831','#4f1933','#501933','#511a34','#511b36','#521c37','#531c37','#531d39','#541e3a','#551f3a','#561f3c','#56203d','#57213e','#58223f','#582241','#592341','#5a2342','#5b2444','#5c2545','#5c2546','#5d2647','#5e2749','#5e2849','#5f284a','#60294c','#602a4c','#612b4e','#622b4f','#632c50','#642c50','#662c4f','#692c4f','#6a2c4f','#6e2b4e','#6f2b4e','#712b4d','#732b4d','#742b4d','#772b4c','#7a2a4b','#7c2a4b','#7c2a4b','#7e2a4a','#81294a','#832949','#842949','#872949','#892848','#8a2848','#8d2848','#8f2747','#912747','#932646','#952646','#972545','#982545','#9b2444','#9d2444','#9f2344','#a02343','#a32243','#a42142','#a62142','#a92042','#ab1f41','#ad1e41','#ae1d40','#b01c40','#b21b3f','#b31b3f','#b7193e','#b8183e','#b91a3f','#b91d40','#ba1f41','#bb2042','#bb2244','#bc2344','#bc2646','#bd2747','#bd2948','#be2a49','#bf2b49','#bf2e4b','#c0304c','#c1304b','#c2324b','#c3344a','#c3354a','#c43649','#c53749','#c53948','#c63a48','#c73c47','#c83d47','#c93e46','#c93f46','#ca4045','#cb4144','#cc4344','#cd4443','#cd4643','#ce4642','#cf4742','#cf4941','#d14a40','#d14c3f','#d24c3f','#d34d3e','#d34f3e','#d44f3d','#d5513d','#d6523c','#d7533b','#d7543a','#d8563a','#d95739','#d95838','#da5838','#db5937','#dc5b36','#dd5c35','#dd5e34','#de5f33','#df5f33','#df6032','#e06131','#e16330','#e16432','#e16533','#e26734','#e26836','#e26937','#e26b39','#e26d3a','#e26f3c','#e26f3c','#e3713e','#e3723f','#e37342','#e37443','#e37745','#e37746','#e47847','#e47a48','#e47b4a','#e47c4b','#e47d4c','#e4804d','#e4814c','#e4824c','#e4834c','#e4864b','#e4874b','#e4874b','#e48a4a','#e48b4a','#e48d49','#e48d49','#e48e49','#e49048','#e49248','#e49348','#e49447','#e49547','#e49746','#e49946','#e49946','#e49b45','#e49c45','#e49e44','#e49f44','#e4a143','#e4a143','#e4a243','#e4a442','#e4a542','#e4a641','#e4a841','#e3aa40','#e3ab3f','#e3ac3f','#e3ae3e','#e3af3e','#e3b03d','#e3b13d','#e3b23c','#e3b43c','#e3b53b','#e2b73a','#e2b83a','#e2b939','#e2ba38','#e2bb39','#e2bd3c','#e1bf41','#e1c043','#e0c145','#e0c247','#dfc44c','#dfc54e','#dec650','#ddc754','#ddc857','#ddc959','#dccb5b','#dbcd5f','#dbce61','#dccf64','#ddcf65','#ded068','#ded068','#ded26a','#dfd36d','#e0d36f','#e0d571','#e1d573','#e2d776','#e3d778','#e3d87a','#e3d97b','#e4da7c','#e5da7e','#e5dc81','#e6dd83','#e7dd85','#e7df87','#e8e08a','#e8e08b','#e9e18d','#e9e28f','#eae290','#eae492','#ebe594','#ece596','#ece799','#ede79b','#ede89d','#eeea9f','#efeaa1','#efeba3','#efeca4','#f0eca5','#f0eea8','#f1efaa','#f1f0ac','#f2f1ae','#f3f1b0','#f3f2b2','#f4f4b5','#f4f5b7','#f5f5b9','#f5f7bb','#f6f7bc','#f6f8be']
    res['joshuastevens']['Carrots'] = {
        'type': 'sequential',
        'url': 'https://gist.github.com/jscarto/167b38829aa9eb3758a4f8b1bc3d723f',
        'values': {},
    }

    for i in range(2, 21):
        res['joshuastevens']['Carrots']['values'][i] = sample(carrots, i)

    # Blue Fluorite Palette : https://gist.github.com/jscarto/6cc7f547bb7d5d9acda51e5c15256b01 / https://twitter.com/jscarto/status/1308419386622070786
    blue_fluorite = ['#291b32', '#2a1b34', '#2b1b34', '#2d1c36', '#2f1c38', '#301c39', '#301d3a', '#321d3b', '#331d3d', '#351d3f', '#351e40', '#371e41', '#381e43', '#3a1e45', '#3b1f45', '#3c1f46', '#3e1f48', '#3f1f4a', '#401f4c', '#42204d', '#43204e', '#44204f', '#462051', '#472052', '#482054', '#4a2056', '#4a2157', '#4c2158', '#4e215a', '#4f215b', '#50215d', '#52215e', '#532160', '#552162', '#552263', '#562264', '#582265', '#592267', '#5b2268', '#5c226b', '#5e226c', '#5f226e', '#60226f', '#622271', '#632272', '#642274', '#662276', '#672277', '#692278', '#6a227a', '#6c227b', '#6e227d', '#6e237e', '#6f247f', '#702480', '#712581', '#722681', '#732683', '#742783', '#752884', '#762985', '#772987', '#792a87', '#792b88', '#7a2c89', '#7b2c8a', '#7c2d8a', '#7d2d8c', '#7e2e8d', '#7f2f8d', '#80308e', '#813190', '#823191', '#833292', '#843292', '#863393', '#863494', '#873595', '#893596', '#8a3697', '#8b3798', '#8b3899', '#8c389a', '#8e399b', '#8e3a9c', '#8f3b9c', '#8f3d9d', '#8f3e9e', '#903f9e', '#90419e', '#90439f', '#9044a0', '#9046a0', '#9047a1', '#9049a1', '#914aa2', '#914ca2', '#914ca3', '#914ea3', '#9150a4', '#9151a5', '#9153a5', '#9154a6', '#9156a6', '#9157a7', '#9258a7', '#9259a8', '#925aa8', '#925ba9', '#925da9', '#925faa', '#9260ab', '#9260ab', '#9263ac', '#9264ac', '#9265ad', '#9266ae', '#9268ae', '#9269ae', '#926aaf', '#926bb0', '#926cb0', '#926eb1', '#926fb1', '#9270b2', '#9271b2', '#9273b3', '#9274b3', '#9275b4', '#9277b5', '#9277b5', '#9278b6', '#927ab6', '#927bb7', '#927cb7', '#927eb8', '#927fb8', '#9280b9', '#9281ba', '#9282ba', '#9284bb', '#9285bb', '#9285bc', '#9187bc', '#9188bd', '#918abd', '#918bbe', '#918cbf', '#918dbf', '#918ec0', '#918fc0', '#9191c1', '#9092c2', '#9094c2', '#9094c2', '#9095c3', '#9096c3', '#8f99c4', '#8f9ac5', '#8f9ac5', '#8f9bc6', '#8f9cc6', '#8f9dc7', '#8e9fc8', '#8ea0c8', '#8ea2c9', '#8ea3c9', '#8da5ca', '#8da5ca', '#8da6cb', '#8da7cb', '#8ca9cc', '#8caacc', '#8caccd', '#8bacce', '#8badce', '#8baecf', '#8ab0d0', '#8ab2d0', '#8ab2d1', '#8ab4d1', '#89b4d1', '#89b5d2', '#89b7d2', '#88b8d3', '#88bad4', '#87bad4', '#87bbd5', '#86bdd6', '#86bed6', '#86c0d7', '#85c0d7', '#85c1d8', '#84c3d8', '#84c4d9', '#83c5d9', '#83c6da', '#82c8da', '#82c8db', '#81cadc', '#81cbdc', '#80ccdd', '#81cddd', '#84cfdd', '#85cfdd', '#87d0dd', '#8ad0de', '#8dd1de', '#8fd2de', '#90d2de', '#92d4de', '#95d5de', '#97d5de', '#98d6de', '#9bd7de', '#9dd7df', '#a0d8df', '#a1d9df', '#a2dadf', '#a5dadf', '#a7dbdf', '#aadcdf', '#abdddf', '#acdde0', '#afdfe0', '#b1dfe0', '#b3e0e0', '#b4e1e0', '#b7e2e0', '#bae2e1', '#bae3e1', '#bee3e2', '#c0e4e3', '#c1e5e3', '#c4e6e3', '#c6e6e4', '#c8e7e4', '#cbe7e5', '#cde8e5', '#cee9e6', '#d2e9e7', '#d3eae7', '#d5eae7', '#d8ebe8', '#d9ece8', '#dcece9', '#deedea', '#dfeeea', '#e2eeea', '#e5efeb', '#e6f0eb', '#e9f0ec', '#ebf1ed', '#ecf2ed', '#eff3ee', '#f1f3ee']

    res['joshuastevens']['BlueFluorite'] = {
        'type': 'sequential',
        'url': 'https://gist.github.com/jscarto/6cc7f547bb7d5d9acda51e5c15256b01',
        'values': {},
    }

    for i in range(2, 21):
        res['joshuastevens']['BlueFluorite']['values'][i] = sample(blue_fluorite, i)

    # Arid Elevation Palette : https://gist.github.com/jscarto/392c7854cdb73aa82b416bfaf53efcc9
    arid_eleveation = ['#999188','#9a9188','#9a9288','#9b9289','#9b9289','#9b938a','#9c938a','#9c948a','#9d948b','#9d948b','#9d958b','#9e968c','#9e968c','#9f968c','#9f978c','#a0978d','#a0978d','#a0988d','#a1998e','#a1998e','#a2998e','#a29a8f','#a29a8f','#a39b90','#a39b90','#a49c90','#a49b90','#a49c90','#a69d91','#a69c91','#a79d92','#a79e92','#a79e92','#a89e93','#a89e93','#a99f93','#a99f94','#aaa094','#aaa094','#aaa094','#aba295','#aba295','#aca296','#aca296','#aca396','#ada397','#ada497','#aea497','#aea598','#aea598','#afa599','#afa699','#b0a699','#b1a699','#b1a799','#b2a89a','#b2a89a','#b3a89b','#b3a99b','#b3a99c','#b4a99c','#b4aa9c','#b5aa9d','#b5aa9d','#b6ab9d','#b6ac9e','#b6ab9e','#b7ac9e','#b7ac9e','#b8ad9f','#b8ad9f','#b9ae9f','#b9afa0','#b9aea0','#baafa1','#bbafa1','#bbb0a1','#bcb1a2','#bcb0a2','#bdb1a3','#bdb2a3','#beb2a3','#beb2a4','#beb2a4','#bfb4a4','#bfb4a4','#bfb4a5','#c0b4a5','#c0b5a6','#c1b6a6','#c1b6a6','#c2b7a7','#c2b6a7','#c3b7a7','#c4b8a8','#c4b7a8','#c5b8a9','#c5b9a9','#c5b9aa','#c6b9aa','#c6b9aa','#c7bbab','#c7bbab','#c8bbab','#c8bbac','#c8bcac','#c9bcad','#c9bdad','#cabdae','#cabdae','#cabeae','#ccbfaf','#ccbfaf','#ccbfaf','#cdc0b0','#cec0b0','#cec1b1','#cec0b1','#cfc2b2','#cfc2b2','#cfc2b2','#d0c2b3','#d1c3b3','#d2c3b4','#d2c3b4','#d2c4b5','#d3c4b5','#d3c4b5','#d4c5b7','#d4c6b7','#d4c6b7','#d6c6b9','#d6c6bb','#d6c7bb','#d6c7bc','#d6c8bd','#d7c9be','#d7c8be','#d7cac0','#d7cac0','#d8cbc1','#d8cac1','#d8cbc2','#d8ccc2','#d8cdc4','#d8ccc4','#d9cec5','#d9cdc5','#d9cec7','#d9cec7','#dacfc7','#dad0c8','#dad0c9','#dbd1c9','#dbd1c9','#dbd2cb','#dbd2cb','#dcd2cc','#dcd3cc','#dcd3cd','#dcd3cd','#ddd4cf','#ddd5cf','#ded5d0','#ded5d0','#ded6d0','#ded6d1','#ded7d2','#dfd7d2','#dfd8d3','#e0d9d4','#e0d8d4','#e0d9d5','#e0d9d5','#e1dad6','#e1dbd6','#e1dbd7','#e2dbd7','#e2dcd7','#e2dcd9','#e3ddd9','#e3ddda','#e3ddda','#e4dfdb','#e4dfdb','#e5dfdc','#e5e0dc','#e5e1dd','#e5e0dd','#e6e1de','#e6e1df','#e6e2df','#e7e3e0','#e7e2e0','#e8e4e1','#e8e4e1','#e8e4e2','#e8e5e2','#e9e5e3','#e9e5e3','#eae6e4','#eae7e4','#eae7e5','#ebe7e5','#ebe8e5','#ece8e7','#ece8e7','#eceae8','#ece9e8','#edeae9','#edebe9','#edebe9','#eeecea','#eeecea','#efeceb','#efeceb','#f0edec','#f0eeec','#f1eeed','#f1eeed','#f1f0ee','#f1efee','#f2f0ee','#f2f1ef','#f2f1f0','#f3f2f1','#f3f2f1','#f4f3f2','#f4f3f2','#f5f3f3','#f5f4f3','#f6f4f4','#f6f4f4','#f6f5f4','#f7f6f5','#f7f6f5','#f7f6f6','#f7f7f6','#f8f7f7','#f8f7f7','#f9f8f8','#f9f9f8','#faf9f9','#fafaf9','#fbfafa','#fbfafa','#fbfbfb','#fcfcfb','#fcfcfb','#fdfcfc','#fdfdfc','#fefdfd','#fefefd','#fefefe','#fffffe','#ffffff']

    res['joshuastevens']['AridElevation'] = {
        'type': 'sequential',
        'url': 'https://gist.github.com/jscarto/392c7854cdb73aa82b416bfaf53efcc9',
        'values': {},
    }

    for i in range(2, 21):
        res['joshuastevens']['AridElevation']['values'][i] = sample(arid_eleveation, i)

    # Florida Palette : https://gist.github.com/jscarto/218474b4962a022644c3b05af193a4b3
    florida_colors = ['#060910','#070a12','#080b14','#080d15','#090e17','#0a0f18','#0b101a','#0b111b','#0c121d','#0c131e','#0d1420','#0d1422','#0d1524','#0e1625','#0e1725','#0f1726','#101927','#101927','#111928','#131b29','#141b29','#141b2a','#151c2a','#161d2b','#171e2b','#181f2c','#191f2d','#1a202e','#1a212e','#1b222f','#1c222f','#1e2330','#1e2430','#1f2531','#202532','#212632','#212633','#222834','#232834','#242935','#252935','#262b36','#272c37','#282c38','#292d38','#292d38','#2a2f39','#2c303a','#2c303b','#2d303b','#2e313c','#2f323c','#30333d','#31343e','#31343e','#32353f','#333740','#353740','#36383f','#38383e','#3b393e','#3b3a3d','#3e3b3c','#403b3b','#403c3b','#423c3a','#453d39','#453e39','#473f38','#494037','#4a4036','#4c4036','#4e4235','#504234','#514333','#524433','#544431','#554531','#564530','#58472f','#5a472e','#5a482e','#5c492d','#5e4a2b','#604a2b','#604b2a','#624c29','#644d28','#654d27','#684d27','#684e28','#6b4e28','#6e4f28','#704f29','#724f29','#744f29','#765029','#79502a','#7b502a','#7c502a','#7e512b','#81512b','#83522b','#85522c','#87522c','#8a522d','#8c532d','#8e532d','#90532d','#93532e','#95532e','#96542e','#98542f','#9a542f','#9d542f','#a05430','#a15430','#a35530','#a55531','#a85531','#a95631','#ab5730','#ad5730','#ae5830','#af5930','#b05a2f','#b25a2f','#b45b2e','#b45c2e','#b65d2e','#b75e2d','#b85e2d','#b95f2d','#bb5f2c','#bd602c','#be612b','#c0622b','#c1632b','#c2642a','#c4642a','#c56529','#c66629','#c76729','#c96828','#ca6827','#cb6927','#cd6a26','#cf6b26','#d06b25','#d26c25','#d26d24','#d46e24','#d66e23','#d77022','#d97022','#d97121','#db7221','#dd7320','#de731f','#e0741f','#e1751e','#e2751d','#e4761c','#e5771b','#e6781b','#e8791a','#e97a19','#eb7a18','#ed7b16','#ee7c15','#ef7d14','#f17e13','#f27e12','#f47f10','#f5800e','#f6810d','#f8820c','#f9830a','#fb8307','#fc8505','#fd8503','#ff8602','#ff8701','#ff8a02','#ff8c02','#ff8c02','#ff8f03','#ff9103','#ff9303','#ff9404','#ff9604','#ff9805','#ff9805','#ff9a05','#ff9d06','#ff9e06','#ffa007','#ffa107','#ffa208','#ffa408','#ffa609','#ffa709','#ffa90a','#ffab0a','#ffad0b','#ffad0b','#ffaf0c','#ffb00c','#ffb30d','#ffb40d','#ffb60e','#ffb70f','#ffb80f','#ffba10','#ffbc10','#ffbd11','#ffbe11','#ffc112','#ffc212','#ffc413','#ffc513','#ffc714','#ffc714','#ffc915','#ffca15','#ffcc15','#ffce16','#ffcf16','#ffd117','#ffd217','#ffd318','#ffd518','#ffd619','#ffd719','#ffda1a','#ffda1a','#ffdc1b','#ffde1b','#ffde1c','#ffe01c','#ffe21d','#ffe41d','#ffe51e','#ffe61e','#ffe81f','#ffe81f','#ffeb20','#ffec20','#ffed21','#ffee21','#fff021','#fff222','#fff323','#fff523','#fff624','#fff724']

    res['joshuastevens']['Florida'] = {
        'type': 'sequential',
        'url': 'https://gist.github.com/jscarto/218474b4962a022644c3b05af193a4b3',
        'values': {},
    }

    for i in range(2, 21):
        res['joshuastevens']['Florida']['values'][i] = sample(florida_colors, i)

    with open('./src/palettes.json', 'w') as f:
        f.write(json.dumps(res, indent=4))

    with open('./src/cbf.json', 'w') as f:
        f.write(json.dumps(cbf))
