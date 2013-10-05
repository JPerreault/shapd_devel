function saveSTL(mesh)
{
		var stlFile = createSTL(mesh);
		var blob = new Blob ([stlFile], {type: 'text/plain'});
		saveAs (blob, 'test.stl');
}

//Generates an STL file using the shape currently on the screen.
function createSTL(mesh)
{
	stl = 'solid test \n';	
	if (mesh.children.length !== 0)
	{
		for (var t = 0; t < mesh.children.length; t++)
			{
				for (var j = 0; j < mesh.children[t].children.length; j++)
				{
					var vertices = mesh.children[t].children[j].geometry.vertices;
					var faces = mesh.children[t].children[j].geometry.faces;
						
					//Loop for all faces, adding each vertex to the stl file and making triangles from them.
					for (var i = 0; i < faces.length; i++)
					{
						stl += 'facet normal ' + convertVectorToString(faces[i].normal) + ' \n';
						stl += 'outer loop \n';
						stl += convertVertexToString(vertices[faces[i].a]);
						stl += convertVertexToString(vertices[faces[i].b]);
						stl += convertVertexToString(vertices[faces[i].c]);
						stl += 'endloop \n';
						stl += 'endfacet \n';
						
						if (faces[i] instanceof THREE.Face4)
						{
							stl += 'facet normal ' + convertVectorToString(faces[i].normal) + ' \n';
							stl += 'outer loop \n';
							stl += convertVertexToString(vertices[faces[i].a]);
							stl += convertVertexToString(vertices[faces[i].c]);
							stl += convertVertexToString(vertices[faces[i].d]);
							stl += 'endloop \n';
							stl += 'endfacet \n';
						}
					}
				}
			}
	}
	else
	{
		var vertices = mesh.geometry.vertices;
		var faces = mesh.geometry.faces;
			
		//Loop for all faces, adding each vertex to the stl file and making triangles from them.
		for (var i = 0; i < faces.length; i++)
		{
			stl += 'facet normal ' + convertVectorToString(faces[i].normal) + ' \n';
			stl += 'outer loop \n';
			stl += convertVertexToString(vertices[faces[i].a]);
			stl += convertVertexToString(vertices[faces[i].b]);
			stl += convertVertexToString(vertices[faces[i].c]);
			stl += 'endloop \n';
			stl += 'endfacet \n';
			
			if (faces[i] instanceof THREE.Face4)
			{
				stl += 'facet normal ' + convertVectorToString(faces[i].normal) + ' \n';
				stl += 'outer loop \n';
				stl += convertVertexToString(vertices[faces[i].a]);
				stl += convertVertexToString(vertices[faces[i].c]);
				stl += convertVertexToString(vertices[faces[i].d]);
				stl += 'endloop \n';
				stl += 'endfacet \n';
			}
		}
	}
		stl += 'endsolid';
		
		return stl;
}

function convertVectorToString(vector)
{
	return ''+ vector.x*.12 + ' '+ vector.y*.12 + ' '+ vector.z*.12;
}

function convertVertexToString(vector)
{
	return 'vertex '+ convertVectorToString(vector) + ' \n';
}