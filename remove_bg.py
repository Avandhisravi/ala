from PIL import Image, ImageFilter

def remove_bg_flood(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert('RGBA')
        width, height = img.size
        
        # Create a mask for the background (start with all 255 - object)
        mask = Image.new('L', (width, height), 255)
        mask_pixels = mask.load()
        img_pixels = img.load()
        
        visited = set()
        queue = []
        
        # Add all border pixels to queue
        for x in range(width):
            queue.append((x, 0))
            queue.append((x, height-1))
        for y in range(height):
            queue.append((0, y))
            queue.append((width-1, y))
            
        threshold = 5
        q = []
        
        for start_node in queue:
            if start_node not in visited:
                r,g,b,a = img_pixels[start_node[0], start_node[1]]
                if r < threshold and g < threshold and b < threshold:
                    q.append(start_node)
                    visited.add(start_node)
                    
        while q:
            x, y = q.pop()
            mask_pixels[x, y] = 0
            
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    nr, ng, nb, na = img_pixels[nx, ny]
                    if nr < threshold and ng < threshold and nb < threshold:
                        visited.add((nx, ny))
                        q.append((nx, ny))
                        
        # Erode mask slightly to remove dark halos, then blur for anti-aliasing (smooth edges)
        mask = mask.filter(ImageFilter.MinFilter(3))
        mask = mask.filter(ImageFilter.GaussianBlur(1.5))
        
        # Apply the blurred mask to the alpha channel
        img.putalpha(mask)
        
        img.save(output_path, 'PNG')
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

remove_bg_flood('19.jpeg', '19_cutout.png')
remove_bg_flood('20.jpeg', '20_cutout.png')
